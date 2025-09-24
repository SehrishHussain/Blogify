import React from 'react'
import {useDispatch} from 'react-redux'
import { authService } from "../../services";
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-[#e2cbb8] dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200
             transform hover:scale-105 hover:shadow-lg rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn
