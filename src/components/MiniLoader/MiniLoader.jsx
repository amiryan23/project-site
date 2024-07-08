import s from './MiniLoader.module.scss'
import { ThreeDots,ThreeCircles } from 'react-loader-spinner'


const MiniLoader = () =>{
	return (
		<div className={s.megaContainer}>
  {/*   <ThreeDots */}
  {/* visible={true} */}
  {/* height="40" */}
  {/* width="40" */}
  {/* color="#ffffff" */}
  {/* radius="9" */}
  {/* ariaLabel="three-dots-loading" */}
  {/* wrapperStyle={{}} */}
  {/* wrapperClass="" */}
  {/* /> */}
<ThreeCircles
  visible={true}
  height="50"
  width="50"
  color="whitesmoke"
  ariaLabel="three-circles-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
		</div>
		)
}


export default MiniLoader