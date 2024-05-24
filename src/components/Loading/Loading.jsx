import s from './Loading.module.scss'
import { MutatingDots } from 'react-loader-spinner'

const Loading = ()=>{
    return (
        <div className={s.container}>
         <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="whitesmoke"
        secondaryColor="whitesmoke"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
        </div>
    )
}

export default Loading