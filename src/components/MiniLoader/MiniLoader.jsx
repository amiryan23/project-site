import s from './MiniLoader.module.scss'
import { ThreeDots } from 'react-loader-spinner'


const MiniLoader = () =>{
	return (
		<div className={s.megaContainer}>
    <ThreeDots
  visible={true}
  height="40"
  width="40"
  color="#ffffff"
  radius="9"
  ariaLabel="three-dots-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
		</div>
		)
}


export default MiniLoader