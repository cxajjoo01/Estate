import Home from "./pages/Home";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from "./pages/Profile";
import About from './pages/About';



const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path = '/' element ={<Home/>}/>
      <Route path = '/signIn' element ={<SignIn/>}/>
      <Route path = '/signUp' element ={<SignUp/>}/>
      <Route path = '/profile' element ={<Profile/>}/>
      <Route path = '/about' element ={<About/>}/>
    </Routes>
   </BrowserRouter>
  );
};

export default App;