import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function Footer() {
    return (
        <div className="grid grid-cols-4 gap-8 justify-items-center">
            <div>
                <Card className="w-full rounded-lg border border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>Get Started and Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-gray-400'>Begin your journey by clicking on the "Get Started" button. Sign in to your account and click on the Dashboard button to get started.</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card className="w-full rounded-lg border border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>Create Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-gray-400'>Click on the "Create Form" button. Add a description to your form to provide context and information to your users.</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card className="w-full rounded-lg border border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>Preview and Edit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-gray-400'>Customize your form by adding or removing form fields. Adjust the theme and styling to match your preferences and branding.</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card className="w-full rounded-lg border border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle>Share and Export responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-gray-400'>Once your form is ready, share it with your desired audience. Track responses easily by accessing the Responses section.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Footer;
