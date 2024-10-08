import logo from './logo.svg';
import './App.css';
import React,{Suspense,useEffect} from 'react'
import Header from './components/Header/Header'
import Notification from './components/Notification/Notification'
import Loading from './components/Loading/Loading'
import Footer from './components/Footer/Footer'
import './i18n';
import { BrowserRouter,Route,Routes,useLocation  } from 'react-router-dom';
import { MyContextProvider } from './context/Context'; 
import {InstagramEmbedLoader} from './helper/instaPost'

const Home = React.lazy(()=>import("./components/Home/Home"))
const Login = React.lazy(()=>import("./components/Login/Login"))
const Registration = React.lazy(()=>import("./components/Registration/Registration"))
const Modal = React.lazy(()=>import("./components/Modal/Modal"))
const ModalStory = React.lazy(()=>import("./components//ModalStory/ModalStory"))


const  ScrollToTop = () => {


  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <MyContextProvider>
    <BrowserRouter>
    <ScrollToTop />

    <div className="App">
    <InstagramEmbedLoader/>
      <Header />
      <Modal />
      <ModalStory/>
      <Suspense fallback={<Loading />}>
      <Routes>
      <Route path="/home/*" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      </Routes>
      </Suspense>
      <Notification />
      <Footer />
    </div>
    </BrowserRouter>
    </MyContextProvider>
  );
}

export default App;
