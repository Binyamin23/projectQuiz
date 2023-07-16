import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doApiPost } from "../../services/apiService";
import { RESET_PASSWORD } from "../../services/apiService";
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { getValues, register, handleSubmit, formState: { errors } } = useForm();
    const nav = useNavigate();

    const validateConfirmPassword = (value) => {
        if (value !== getValues('password')) {
            return 'Passwords do not match';
        }
    };

    const [query] = useSearchParams();

    const resetPassword = async ({ password }) => {
        try {
            const { data } = await doApiPost(RESET_PASSWORD, {
                userId: query.get('id'),
                resetString: query.get('str'),
                newPassword: password
            });
            console.log(data);
            toast.success("Your password has changed");
            nav('/login')
        } catch (err) {
            console.log(err.response);
        }
    };

    const onSub = async (bodyData) => {
        console.log(bodyData);
        await resetPassword(bodyData);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSub)} className="mt-5">
                <h3 className='mb-3'>Reset Password</h3>
                <div className="form-group">
                    <label className="sr-only">Password</label>
                    <input
                        {...register('password', { required: true, minLength: 3, maxLength: 20 })}
                        type="password"
                        className="form-control mt-2"
                        placeholder="Password"
                    />
                    {errors.password && <p className='text-danger'>Password is required </p>}
                </div>
                <div className="form-group">
                    <label className="sr-only">Confirm Password</label>
                    <input
                        {...register('confirmPassword', {
                            required: { value: true, message: 'Confirm password is required' },
                            validate: validateConfirmPassword
                        })}
                        type="password"
                        className="form-control mt-2"
                        placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && <p className='text-danger'>{errors.confirmPassword.message} </p>}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block mt-3">Reset Password</button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;