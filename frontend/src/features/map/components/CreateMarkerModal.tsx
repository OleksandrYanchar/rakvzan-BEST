import { Alert, Box, Button, Checkbox, CircularProgress, colors, FormControl, FormControlLabel, FormGroup, Modal, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import { FC, useState } from "react"
import LoadImage from "../../loadImageComponent/LoadImage"
import { useLazyActivateQuery, usePostMarkerMutation, usePostPhotosMutation, useLazyActivateFormQuery } from "../slices/markerSlices"
import { ReactComponent as SucccessImage } from '../assets/images/success.svg'
import { ReactComponent as UnSucccessImage } from '../assets/images/unSuccess.svg'
import { ReactComponent as NotFoundDataImage } from '../assets/images/notFoundData.svg'
import ERDPOYForm from "./ERDPOYForm"

interface CreateMarkerModalInterface {
    isOpen: boolean
    handleClose: () => void
    lat: number
    lng: number
}

const CreateMarkerModal: FC<CreateMarkerModalInterface> = ({
    isOpen,
    handleClose: upperHandeClose,
    lat,
    lng,
}) => {
    const [triggerPostMarker, {data: postMarkerData}] = usePostMarkerMutation()
    const [triggerPostMarkerPhotos] = usePostPhotosMutation()
    const [triggerActivate] = useLazyActivateQuery()
    const [triggerActivateForm] = useLazyActivateFormQuery()
    const [formStatus, setFormStatus] = useState<'nonActive' | 'error' | 'success' | 'secondConfirmModalIsNessesary' | 'secondConfirmModal'>('secondConfirmModalIsNessesary')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleClose = () => {
        upperHandeClose()
        setFormStatus("nonActive")
    }

    return(
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                '& .MuiBackdrop-root':{
                    background: 'none'
                }
            }}
            >
            <Box
                sx={{ 
                    width: '25svw',
                    height: formStatus ==='secondConfirmModal'?'90svh': '40svh',
                    background: colors.common.white,
                    padding: '24px',
                    borderRadius:" 25px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflowY: 'auto',
                    position: 'relative',
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
                        setIsLoading(true)
                        await triggerPostMarker({
                            name: values.name,
                            latitude: lat,
                            longitude: lng,
                            address: values.address,
                            edrpou: values.EDRPOYCode
                        }).catch(() => {
                            setFormStatus('error')
                            setIsLoading(false)
                        }).then((res: any) => {
                            if (res.data.data.id){
                                triggerPostMarkerPhotos({
                                    photos: values.photos,
                                    id: res.data.data.id,
                                }).then((res)=>{
                                    triggerActivate({id: res.data.data.id}).then((res) => {
                                        if (res.data.data.status) {
                                            setFormStatus('success')
                                        } else {
                                            setFormStatus('secondConfirmModalIsNessesary')
                                        }
                                    })
                                    
                                })
                                setIsLoading(false)
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
                                loading={isLoading}
                                type="submit"
                                variant="contained"
                                sx={{
                                    marginTop: '32px'
                                }}
                            >
                                Зберегти
                            </Button>
                            </FormControl>
                        </form>} 
                        {isLoading && <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItens: 'center',
                                zIndedx: 20,
                                alignItems: 'center',
                            }}
                        >
                            <CircularProgress />
                        </Box>}
                        {formStatus === 'success' && <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                width: 'fit-content'
                            }}
                        >
                            <SucccessImage
                                style={{
                                    width: '100%'
                                }}
                            />
                            <Button
                                variant='outlined'
                                onClick={()=>{
                                    handleClose()
                                }}
                            >
                                Закрити вікно
                            </Button>
                        </Box>
                        } 
                        {formStatus === 'secondConfirmModal' && <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                width: 'fit-content'
                            }}
                        >
                            <ERDPOYForm
                                isLoading={false}
                                submitAction={(body: any)=>{
                                    triggerActivateForm({
                                        ...body,
                                        id: 123
                                    })
                                }}
                            />
                            <Button
                                variant='outlined'
                                onClick={()=>{
                                    handleClose()
                                }}
                            >
                                Закрити вікно
                            </Button>
                        </Box>
                        } 
                        {formStatus === 'secondConfirmModalIsNessesary' && <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                width: 'fit-content'
                            }}
                        >
                            <NotFoundDataImage
                                style={{
                                    width: '100%'
                                }}
                            />
                            <Typography variant='h5'>
                            На ресурсі Gov.ua <a href='https://api.spending.gov.ua/' target="_blank" rel="noopener noreferrer">“https://api.spending.gov.ua/”</a> <br/>
                                ми не змогли підтверди ваші данні.
 
                            </Typography>
                            <Button
                                variant='contained'
                                onClick={()=>{
                                    setFormStatus('secondConfirmModal')
                                }}
                            >
                                Пройти перевірку
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={()=>{
                                    handleClose()
                                }}
                            >
                                Закрити вікно
                            </Button>
                        </Box>
                        } 
                        {formStatus === 'error' && <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                width: 'fit-content'
                            }}
                        >
                            <UnSucccessImage
                                style={{
                                    width: '100%'
                                }}
                            />
                            <Button
                                variant='outlined'
                                onClick={()=>{
                                    handleClose()
                                }}
                            >
                                Закрити вікно
                            </Button>
                        </Box>
                        } 

                    </>
                    
                )}
                </Formik>
            </Box>
        </Modal>
    )
}

export default CreateMarkerModal