import * as Yup from 'yup'
import { VAR_NAME } from './const'

const validationSchema = Yup.object().shape({
    [VAR_NAME.SOURCE_CURRENCY]: Yup.string().required(),
    [VAR_NAME.SOURCE_PRICE]: Yup.number().required().moreThan(0),
    [VAR_NAME.TARGET_CURRENCY]: Yup.string().required(),
})

export default validationSchema
