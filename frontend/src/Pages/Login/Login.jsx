import React, { useState } from 'react'
import { NavLink, useNavigate, Navigate, Link } from 'react-router-dom'
import logo from "../../../public/assets/images/logos/logo.jpeg"
import bg from "../../../public/assets/images/backgrounds/bglogs.jpeg"
import AuthService from '../../Services/Auth/AuthService'
import Toaster from '../../Utils/Constants/Toaster'
import { useFormik } from 'formik'
import ResponseHandler from '../../Utils/Constants/ResponseHandler'
import AuthYup from '../../Validation/Auth/AuthYup'
import LocalStore from '../../Store/LocalStore'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const initValues = {
        email: '',
        password: '',
    }
    const { values, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initValues,
        validationSchema: AuthYup.loginSchema,
        onSubmit: async (values) => {
            setLoading(true)
            Toaster.loadingToast("Validating User .......")
            try {
                const result = await AuthService.authLogin(values)
                if (result.data.code === 201) {
                    const { token, email, role } = result.data.data;
                    LocalStore.storeToken({ token, role, email });
                    Toaster.justToast('success', result.data.data.message, () => {
                        Toaster.dismissLoadingToast()
                        navigate('/main/user/home')
                    })
                }
            } catch (error) {
                alert(error.response.data.data.message)
            } finally {
                setLoading(false)
                Toaster.dismissLoadingToast()
            }
        }
    })

    return (
        <>
            <div className="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundImage: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0 shadow-sm border">
                                <div className="card-body">
                                    <NavLink to={'/login'} className="text-nowrap logo-img text-center d-block py-3 pb-5 w-100">
                                        <img src={logo} className='rounded' width={180} alt="loogo" />
                                    </NavLink>
                                    <form className='needs-validation' noValidate onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                            <input
                                                value={values.email}
                                                onChange={handleChange}
                                                type="email"
                                                name='email'
                                                className={`form-control ${(errors.email && touched.email) ? 'is-invalid' : ''}`}
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        </div>
                                        <div className="mb-0">
                                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                            <input
                                                value={values.password}
                                                onChange={handleChange}
                                                name='password'
                                                type="password"
                                                className={`form-control ${(errors.password && touched.password) ? 'is-invalid' : ''}`}
                                                id="exampleInputPassword1"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        </div>
                                        <div className='w-100 d-flex justify-content-end'>
                                            <Link to={'/forgotPassword'} className='text-primary'>Reset Password</Link>
                                        </div>
                                        <button type='submit' disabled={loading} className="mt-4 btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Sign In</button>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">New User?</p>
                                            <NavLink to={'/register'} className="text-primary fw-bold ms-2">Create an account</NavLink>
                                        </div>
                                        <button type='button' disabled={loading} className="btn btn-white border w-100 py-8 fs-4 mb-2 rounded-2 mt-3">
                                            <img src="https://scontent.fcmb2-2.fna.fbcdn.net/v/t39.30808-6/385770710_873776704103765_3789357224619367570_n.png?_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGDCQAzkoEfk4Q_Qlox7Z52AvbRpmoVtDIC9tGmahW0MlSquhHDAKVCQIabyzyl5mbnIPzVTXHuEMBNwZLvIAyB&_nc_ohc=NMaJp0HsKk8AX8KccmT&_nc_ht=scontent.fcmb2-2.fna&oh=00_AfB14Ld_EmKij872LOYvM4QLSabjr67VUg7ES_nlWabKeg&oe=660D8627"
                                                alt="Google Logo" className="img-fluid rounded me-3" style={{ width: '30px' }} />
                                            Continue With Google
                                        </button>
                                        <button type='button' disabled={loading} className="btn btn-info w-100 py-8 fs-4 mb-4 rounded-2" style={{ backgroundColor: "#0865FF" }}>
                                            <img src="https://scontent.fcmb2-2.fna.fbcdn.net/v/t39.30808-1/380700650_10162533193146729_2379134611963304810_n.jpg?stp=dst-jpg_p320x320&_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEazKBFuFt3x8uuI-TyPFOEtjWzO19RVKS2NbM7X1FUpPsMnhHxh83DoO6TjDHWMi_D_p5pomf0FbhG-E1MnCdW&_nc_ohc=g8BWiHfRgZIAX81pXBJ&_nc_ht=scontent.fcmb2-2.fna&oh=00_AfB_kM0wWw1f3wqUh7G1HkxEVUNg9Wv-bi1h5QEy86q1Nw&oe=660D990E"
                                                alt="facebook Logo" className="img-fluid rounded-circle me-3" style={{ width: '30px' }} />
                                            Continue With FaceBook
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}
