import s from './Loading.module.scss'
import { MutatingDots,Vortex } from 'react-loader-spinner'

const Loading = ()=>{
    return (
        <div className={s.container}>
        {/*  <MutatingDots */}
        {/* visible={true} */}
        {/* height="100" */}
        {/* width="100" */}
        {/* color="whitesmoke" */}
        {/* secondaryColor="whitesmoke" */}
        {/* radius="12.5" */}
        {/* ariaLabel="mutating-dots-loading" */}
        {/* wrapperStyle={{}} */}
        {/* wrapperClass="" */}
        {/* /> */}
<Vortex
  visible={true}
  height="80"
  width="80"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['whitesmoke', '#999', 'whitesmoke', '#999', 'whitesmoke', '#999']}
  />
        </div>
    )
}

export default Loading