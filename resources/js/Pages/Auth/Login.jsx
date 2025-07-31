import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Input } from "antd";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <Input
                        id="email"
                        allowClear
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        status={errors.email ? "error" : ""}
                        size="large"
                        placeholder="Masukkan email"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                        <div className="mt-2 text-red-500 text-xs">
                            {errors.email}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <Input.Password
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        status={errors.password ? "error" : ""}
                        size="large"
                        placeholder="Masukkan password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password && (
                        <div className="mt-2 text-red-500 text-xs">
                            {errors.password}
                        </div>
                    )}
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
