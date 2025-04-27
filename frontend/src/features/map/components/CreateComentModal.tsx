import { Box, Button, Checkbox, colors, FormControl, FormControlLabel, FormGroup, Modal, Rating, TextField, Typography } from "@mui/material"
import { Formik } from "formik"
import { FC, useState } from "react"
import LoadImage from "../../loadImageComponent/LoadImage"
import { AccessibilityListEnum } from "../../../utils/getAccessibilityList"
import { usePostCommentMutation } from "../slices/commentSLice"
import { RootState } from "../../../app/baseStore"
import { useSelector } from "react-redux"

interface CreateComentModalInterface {
    isOpen: boolean
    handleClose: () => void
}

const CreateComentModal: FC<CreateComentModalInterface> = ({
    isOpen,
    handleClose,
}) => {
    
    const detailMarker = useSelector((state: RootState) => state.detailMarker);
    const [triggerPostComment] = usePostCommentMutation();
    const [isOtherSumActive, setIsOtherSumActive] = useState<boolean>(false)

    const [donateVariants, setDonateVariants] = useState<{mount: number, active: boolean}[]>([
        {
            mount: 10,
            active: false,
        },
        {
            mount: 50,
            active: false,
        },
        {
            mount: 100,
            active: false,
        },
        {
            mount: 1000,
            active: false,
        }
    ])

    const handleChangeMount = (mount: number) => {
        setIsOtherSumActive(false)
        setDonateVariants(donateVariants?.map((value) => {
            if (value.mount === mount) {
                return {
                    ...value,
                    active: true
                } 
            } else {
                return {
                    ...value,
                    active: false
                }   
            }
        }))
    }

    const otherSunButtonHandler = () => {
        setIsOtherSumActive(true)
        setDonateVariants(donateVariants?.map((value) => {
                return {
                    ...value,
                    active: false
                }   
        }))
    }

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
                    width: '40svw',
                    height: '40svh',
                    background: colors.common.white,
                    padding: '24px',
                    borderRadius:" 25px",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflowY: 'auto',
                    justifyContent: 'center'
                    
                }}
            >
                <Formik
                    initialValues={{ 
                        comment: '', 
                        rating: 0, 
                        photos: [] as File[], 
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        triggerPostComment({
                            id: detailMarker.id,
                            photos: values.photos,
                            payload: {
                                comment: values.comment,
                                rating: values.rating
                            }
                        }).then((res) => {
                            window.location.reload()
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
                    <form onSubmit={handleSubmit} style={{ width: '80%', marginTop: '24px' }}>
                    <FormControl variant="standard" sx={{ width: '100%' }}>
                    <Typography
                        sx={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '40px',
                            marginBottom: '20px'
                        }}
                    >
                        Донат
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        {donateVariants?.map((value) => {
                            return(
                                <Button
                                    key={value.mount}
                                    variant={value.active?'contained':'outlined'}
                                    onClick={() => {
                                        handleChangeMount(value.mount)
                                    }}
                                >
                                    {`${value.mount} грн.`}
                                </Button>
                            )
                        })}
                        <Button
                            variant={isOtherSumActive?'contained':'outlined'}
                            onClick={()=> otherSunButtonHandler()}
                        >
                            Інша сума
                        </Button>
                    </Box>
                    {isOtherSumActive && 
                    <TextField 
                        id="outlined-basic" 
                        label="Сума" 
                        variant="outlined" 
                        sx={{
                            marginTop: '20px'
                        }}
                    />}
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Зробити донат місячною підпискою" />
                    <Button
                        disabled={!(donateVariants.find((value) => value.active) || isOtherSumActive)}
                        type="submit"
                        variant="contained"
                        sx={{
                            marginTop: '32px'
                        }}
                    >
                        Продовжити
                    </Button>
                    </FormControl>
                    </form>
                )}
                </Formik>
            </Box>
        </Modal>
    )
}

export default CreateComentModal