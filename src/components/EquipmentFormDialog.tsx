import { Input, NativeSelectField, NativeSelectRoot } from "@chakra-ui/react"
import { DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "./ui/dialog"
import { Field } from "./ui/field"
import { useFormik } from "formik"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import * as Yup from 'yup';
import { Equipment } from "@/interface/CreateEquipmentForm"
import { ServiceError } from "@/interface/Error"
import { toast } from "react-toastify"
import useEquipmentStore from "../store/equipmentStore"
import { Button } from "./ui/button"


interface EquipmentFormDialogProps {
  isOpenDialog: boolean
  setOpenDialog: (value: boolean) => void
  selectedEquipment: Equipment | null
}

const EquipmentFormDialog = ({ isOpenDialog, setOpenDialog, selectedEquipment }: EquipmentFormDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { createEquipment, editEquipment } = useEquipmentStore()

  const getEquipmentNumberPrefix = () => {
    return selectedEquipment ? `${selectedEquipment.equipmentNumber.split('-')[0]}-` : `${DateTime.now().toFormat('ddMMyy')}-`
  }

  const successToast = (message: string) => {
    toast.success(message, {
      style: { color: '#18181B' },
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const formik = useFormik({
    initialValues: {
      equipmentNumber: '',
      type: 'BOSCH',
      brand: '',
      name: '',
      nextInspection: "",
      inspectionPeriod: 0,
      expiredDate: "",
      status: 'ENABLE'
    },
    validationSchema: Yup.object({
      equipmentNumber: Yup.string().matches(/^[A-Z][0-9]{3}$/, 'equipment number must start with an uppercase letter followed by three digits.').required('Equipment No. is required.'),
      brand: Yup.string().required('Band is required.'),
      name: Yup.string().required('Name is required.'),
      inspectionPeriod: Yup.number().nullable().required("Inspection period is required."),
      nextInspection: Yup.string().required("Next Inspection is required."),
      expiredDate: Yup.string().required("Expired date is required.")
        .test("isValidDate", "Invalid date", (value) => {
          const parsedDate = DateTime.fromFormat(value, "dd-MM-yyyy");
          return parsedDate.isValid;
        })
        .test(
          "isAfterNextInspection",
          "Expired date must be after Next inspection date",
          function (value) {
            const { nextInspection } = this.parent;
            if (!nextInspection) {
              return true
            }
            return value && DateTime.fromFormat(value, "dd-MM-yyyy") > DateTime.fromFormat(nextInspection, "dd-MM-yyyy")
          }
        ),
    }),
    onSubmit: async (value) => {
      try {
        if (selectedEquipment) {
          await editEquipment(selectedEquipment.id, {
            brand: value.brand,
            name: value.name,
            nextInspection: value.nextInspection,
            expiredDate: value.expiredDate,
            inspectionPeriod: +value.inspectionPeriod,
            status: value.status,
            equipmentNumber: `${getEquipmentNumberPrefix()}${value.equipmentNumber}`
          })
          successToast("Edit equipment success")
        } else {
          await createEquipment({ ...value, equipmentNumber: `${getEquipmentNumberPrefix()}${value.equipmentNumber}` })
          successToast("Create equipment success")
        }
        setOpenDialog(false)
      } catch (error: any) {
        const errorData = error.data as ServiceError
        console.log('errorData.errorKey', errorData.errorKey)
        if (errorData.errorKey === 'EQUIPMENT_NUMBER_IS_ALREADY_EXIST') {
          toast.error('Equipment number is already exist', {
            style: { color: '#18181B' },
            position: "top-right",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else if (errorData.errorKey === 'EQUIPMENT_IS_ALREADY_GENERATE_REPORT') {
          toast.error('Equipment is already generated report', {
            style: { color: '#18181B' },
            position: "top-right",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        else {
          toast.error('Create or edit equipment error,please try again', {
            style: { color: '#18181B' },
            position: "top-right",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
    },
  });

  useEffect(() => {
    if (selectedEquipment) {
      formik.setValues({
        equipmentNumber: selectedEquipment.equipmentNumber.split('-')[1],
        type: selectedEquipment.type,
        brand: selectedEquipment.brand,
        name: selectedEquipment.name,
        nextInspection: DateTime.fromISO(selectedEquipment.nextInspection).toFormat("dd-MM-yyyy"),
        inspectionPeriod: selectedEquipment.inspectionPeriod,
        expiredDate: DateTime.fromISO(selectedEquipment.expiredDate).toFormat("dd-MM-yyyy"),
        status: selectedEquipment.status
      })
      setSelectedDate(DateTime.fromISO(selectedEquipment.expiredDate).toJSDate())
    }
  }, [selectedEquipment])

  const renderDisabledInput = (key: string) => {
    return <Input value={formik.values?.[key]} disabled />
  }
  return <DialogRoot size={"lg"} closeOnInteractOutside={false} onExitComplete={() => {
    formik.resetForm()
    setSelectedDate(null)
  }
  } open={isOpenDialog}>
    <DialogContent>
      <form onSubmit={formik.handleSubmit}>
        <DialogHeader>
          <DialogTitle>{selectedEquipment ? 'Edit Equipment' : 'Add new'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Field label="Type" marginBottom={'10px'}>
            {selectedEquipment ?
              renderDisabledInput("type")
              : <NativeSelectRoot>
                <NativeSelectField
                  placeholder="Select type"
                  value={formik.values.type}
                  onChange={(e) => {
                    if (e.currentTarget.value) {
                      formik.setFieldValue("type", e.currentTarget.value)
                      if (e.currentTarget.value === "EXTERNAL" && formik.values.inspectionPeriod !== 3) {
                        formik.setFieldValue("inspectionPeriod", 3)
                        formik.setFieldValue("nextInspection", DateTime.now().plus({ months: Number(3) }).minus({ days: 1 }).toFormat("dd-MM-yyyy"))
                        if (formik.errors.inspectionPeriod) {
                          formik.setFieldTouched("inspectionPeriod", false)
                          formik.setFieldTouched("nextInspection", false)
                        }
                      }
                    }
                  }}
                  name="type"
                >
                  <option value="BOSCH">Bosch</option>
                  <option value="EXTERNAL">External</option>
                </NativeSelectField>
              </NativeSelectRoot>}
          </Field>
          <Field label="Equipment No." marginBottom={'10px'} invalid={!!formik.touched.equipmentNumber && !!formik.errors.equipmentNumber} errorText={formik.errors.equipmentNumber}>
            <Input name="equipmentNumber"
              value={`${getEquipmentNumberPrefix()}${formik?.values?.equipmentNumber}`}
              onBlur={formik.handleBlur}
              onChange={e => {
                if (e.currentTarget.value !== getEquipmentNumberPrefix().slice(0, -1)) {
                  formik.setFieldValue("equipmentNumber", e.currentTarget.value.replace(getEquipmentNumberPrefix(), ""))
                }
              }}
            />
          </Field>
          <Field label="Name" marginBottom={'10px'} invalid={!!formik.touched.name && !!formik.errors.brand} errorText={formik.errors.name}>
            <Input value={formik?.values?.name} onBlur={formik.handleBlur} onChange={e => { formik.setFieldValue("name", e.currentTarget.value) }} />
          </Field>
          <Field label="Brand" marginBottom={'10px'} invalid={!!formik.touched.brand && !!formik.errors.brand} errorText={formik.errors.brand}>
            <Input value={formik?.values?.brand} onBlur={formik.handleBlur} onChange={e => { formik.setFieldValue("brand", e.currentTarget.value) }} />
          </Field>
          <Field label="Inspection Period" marginBottom={'10px'} invalid={!!formik.touched.inspectionPeriod && !!formik.errors.inspectionPeriod} errorText={formik.errors.inspectionPeriod}>
            <NativeSelectRoot>
              <NativeSelectField
                placeholder="Select Inspection Period"
                value={formik.values.inspectionPeriod || 0}
                onChange={(e) => {
                  if (e.currentTarget.value) {
                    formik.setFieldValue("inspectionPeriod", e.currentTarget.value)
                    formik.setFieldValue("nextInspection", DateTime.now().plus({ months: Number(e.currentTarget.value) }).minus({ days: 1 }).toFormat("dd-MM-yyyy"))
                    if (formik.errors.inspectionPeriod) {
                      formik.setFieldTouched("inspectionPeriod", false)
                      formik.setFieldTouched("nextInspection", false)
                    }
                  }
                }}
                name="inspectionPeriod"
                onBlur={formik.handleBlur}
              >
                <option value={3}>3 Month</option>
                {formik.values.type === "BOSCH" && [<option value={12}>12 Month</option>, <option value={24}>24 Month</option>]}
              </NativeSelectField>
            </NativeSelectRoot>
          </Field>
          <Field label="Next Inspection" marginBottom={'10px'} invalid={!!formik.touched.nextInspection && !!formik.errors.nextInspection} errorText={formik.errors.nextInspection}>
            <Input value={formik?.values?.nextInspection} disabled variant="subtle" />
          </Field>
          <Field label="Expired Date" marginBottom={'10px'} invalid={!!formik.touched.expiredDate && !!formik.errors.expiredDate} errorText={formik.errors.expiredDate}>
            <DatePicker
              name="expiredDate"
              onBlur={formik.handleBlur}
              dateFormat="dd-MM-yyyy"
              selected={selectedDate}
              showMonthDropdown
              showYearDropdown
              onChange={(date) => {
                setSelectedDate(date)
                if (!date) {
                  formik.setFieldValue("expiredDate", null)
                } else {
                  if (DateTime.fromJSDate(date).isValid) {
                    formik.setFieldValue("expiredDate", DateTime.fromJSDate(date).toFormat("dd-MM-yyyy"))
                  }
                }
                // formik.setFieldValue("expiredDate", DateTime.fromJSDate(date).)
              }}
              customInput={<Input readOnly />}
            />
          </Field>
          <Field label="Status" marginBottom={'10px'}>
            <NativeSelectRoot disabled={!!selectedEquipment}>
              <NativeSelectField
                placeholder="Status"
                value={formik.values.status}
                onChange={(e) => formik.setFieldValue("status", e.currentTarget.value)}
                name="status"
              >
                <option value={"ENABLE"}>Enable</option>
                <option value={"DISABLE"}>Disable</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
          </DialogActionTrigger>
          <Button type="submit">Save</Button>
        </DialogFooter>
        <DialogCloseTrigger onClick={() => setOpenDialog(false)} />
      </form>
    </DialogContent>
  </DialogRoot >
}
export default EquipmentFormDialog