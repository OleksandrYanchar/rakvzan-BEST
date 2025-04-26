import { Formik } from "formik";
import { Alert, Box, Button, Checkbox, CircularProgress, colors, FormControl, FormControlLabel, FormGroup, Modal, TextField, Typography } from "@mui/material"
import { FC } from "react";


interface ERDPOYFormInterface {
    submitAction: (value: any) => void
    isLoading: boolean
}

const ERDPOYForm: FC<ERDPOYFormInterface> = ({
    isLoading,
    submitAction,
}) => {
    return(
        <Box
            sx={{
                marginBottom: '20px'
            }}
        >
            <Formik
                validate={values => {}}
                initialValues={{ 
                    number: '', 
                    date: '', 
                    form: '',
                    name: '',
                    erdpu: '',
                    location: '',
                    locationStatus: '',
                    isStartup: false,
                    haveMoney: false,
                    link: ''
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    submitAction(values)
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
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '24px' }}>
                        <FormControl variant="standard" sx={{ width: '100%' }}>
                        <Typography>
                            Додати
                        </Typography>
                        <TextField
                            id="input-with-icon-textfield"
                            value={values.number}
                            name={'number'}
                            placeholder="Номер"
                            onChange={handleChange}
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.number}
                        />
                        <TextField
                            value={values.date}
                            name={'date'}
                            placeholder="Дата"
                            onChange={handleChange}
                            id="input-with-icon-textfield"
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.date}
                        />
                        <TextField
                            value={values.form}
                            name={'form'}
                            placeholder="Правова форма"
                            onChange={handleChange}
                            id="input-with-icon-textfield"
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.form}
                        />
                        <TextField
                            value={values.name}
                            name={'name'}
                            placeholder="Назва"
                            onChange={handleChange}
                            id="input-with-icon-textfield"
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.name}
                        />
                        <TextField
                            value={values.erdpu}
                            name={'erdpu'}
                            placeholder="Код ЄДРПОУ"
                            onChange={handleChange}
                            id="input-with-icon-textfield"
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.erdpu}
                        />
                        <TextField
                            value={values.location}
                            name={'location'}
                            placeholder="Дата проживання"
                            onChange={handleChange}
                            id="input-with-icon-textfield"
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.location}
                        />
                        <TextField
                            value={values.locationStatus}
                            name={'locationStatus'}
                            placeholder="Статус проживання"
                            onChange={handleChange}
                            id="input-with-icon-textfield"
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.locationStatus}
                        />
                        <FormControlLabel control={<Checkbox />} label="Стартап" />
                        <FormControlLabel control={<Checkbox />} label="Дохід" />
                        <TextField
                            value={values.link}
                            name={'link'}
                            placeholder="Посилання"
                            onChange={handleChange}
                            id="input-with-icon-textfield"
                            label=""
                            sx={{
                                width: '100%',
                                marginTop: '16px',
                            }}
                            error={!!errors?.link}
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
                    </form>
                </>
            )}
            </Formik>
        </Box>
    )
}
export default ERDPOYForm