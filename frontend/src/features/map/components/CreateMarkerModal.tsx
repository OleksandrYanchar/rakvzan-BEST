import { Alert, Box, Button, Checkbox, colors, FormControl, FormControlLabel, FormGroup, Modal, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import { FC, useState } from "react"
import LoadImage from "../../loadImageComponent/LoadImage"
import { AccessibilityListEnum } from "../../../utils/getAccessibilityList"
import { usePostMarkerMutation, usePostPhotosMutation } from "../slices/markerSlices"
import { ReactComponent as SucccessImage } from '../assets/images/success.svg'

interface CreateMarkerModalInterface {
    isOpen: boolean
    handleClose: () => void
    lat: number
    lng: number
}

const CreateMarkerModal: FC<CreateMarkerModalInterface> = ({
    isOpen,
    handleClose,
    lat,
    lng,
}) => {
    const [triggerPostMarker] = usePostMarkerMutation()
    const [triggerPostMarkerPhotos] = usePostPhotosMutation()
    const [formStatus, setFormStatus] = useState<'nonActive'|'loading' | 'error' | 'success'>('nonActive')
    return(
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            >
            <Box
                sx={{ 
                    width: '20svw',
                    height: '40svh',
                    background: colors.common.white,
                    padding: '24px',
                    borderRadius:" 25px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflowY: 'auto'
                }}
            >
                <Formik
                    validate={values => {
                        const errors = {photos: ''};
                        if (!values.photos || values.photos.length <= 0) {
                            errors.photos = 'Фото є обов\'язкові';
                        }
                        if (errors.photos.length >0) {
                            return errors;
                        }
                    }}
                    initialValues={{ 
                        name: '', 
                        address: '', 
                        photos: [] as File[],
                        EDRPOYCode: '',
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        await triggerPostMarker({
                            name: values.name,
                            latitude: lat,
                            longitude: lng,
                            address: values.address,
                            edrpou: values.EDRPOYCode
                        }).then((res: any) => {
                            if (res.data.data.id){
                                triggerPostMarkerPhotos({
                                    photos: values.photos,
                                    id: res.data.data.id,
                                }).then(()=>{
                                    
                                })
                            }
                        })
                    }}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                }) => (
                    <>
                        {formStatus === 'nonActive' && <form onSubmit={handleSubmit} style={{ width: '80%', marginTop: '24px' }}>
                                <FormControl variant="standard" sx={{ width: '100%' }}>
                                <Typography>
                                    Додати
                                </Typography>
                                <LoadImage
                                    selectedFiles={values.photos}
                                    setSelectedFiles={(value: File[]) => setFieldValue('photos', value)}
                                />
                                {errors?.photos as string}
                                <TextField
                                    id="input-with-icon-textfield"
                                    value={values.name}
                                    name={'name'}
                                    placeholder="Назва об'єкта"
                                    onChange={handleChange}
                                    label=""
                                    sx={{
                                        width: '100%',
                                        marginTop: '16px',
                                    }}
                                    error={!!errors?.name}
                                />
                                <TextField
                                    value={values.address}
                                    name={'address'}
                                    placeholder="Адреса об'єкта"
                                    onChange={handleChange}
                                    id="input-with-icon-textfield"
                                    label=""
                                    sx={{
                                        width: '100%',
                                        marginTop: '16px',
                                    }}
                                    error={!!errors?.address}
                                />
                                <TextField
                                    value={values.EDRPOYCode}
                                    name={'EDRPOYCode'}
                                    placeholder="Код ЄДРПОУ"
                                    onChange={handleChange}
                                    id="input-with-icon-textfield"
                                    label=""
                                    sx={{
                                        width: '100%',
                                        marginTop: '16px',
                                    }}
                                    error={!!errors?.EDRPOYCode}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        marginTop: '32px'
                                    }}
                                >
                                    Зберегти
                                </Button>
                                </FormControl>
                            </form>
                        } 
                    </>
                    
                )}
                </Formik>
            </Box>
        </Modal>
    )
}

export default CreateMarkerModal