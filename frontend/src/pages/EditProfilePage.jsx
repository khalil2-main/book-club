import EditProfile from "../components/EditProfile";
import Header from "../components/Header"



const EditProfilePage= ({mode})=>{
    return(
        <>
        <Header/>
        <EditProfile mode={mode}/>
        </>
    )
}

export default EditProfilePage;