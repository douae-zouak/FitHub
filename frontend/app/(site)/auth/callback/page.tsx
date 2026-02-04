'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dumbbell, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            // Handle error from backend
            const errorMessages: { [key: string]: string } = {
                'authentication_failed': 'Authentication failed. Please try again.',
                'server_error': 'Server error occurred. Please try again later.',
            };
            setError(errorMessages[errorParam] || 'An unknown error occurred.');
            return;
        }

        if (token) {
            // Save token to localStorage
            localStorage.setItem('token', token);

            // Redirect to home page
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } else {
            setError('No authentication token received.');
        }
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="min-h-screen bg-dark-bg-primary flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-8">
                        <Dumbbell className="w-10 h-10 text-primary-neon" />
                        <span className="font-display font-bold text-3xl text-primary-neon">
                            FitHub
                        </span>
                    </Link>

                    <div className="bg-dark-bg-tertiary rounded-2xl p-8 border border-dark-border">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="font-display font-bold text-2xl mb-4 text-dark-text-primary">
                            Authentication Error
                        </h1>
                        <p className="text-dark-text-secondary mb-6">{error}</p>
                        <Link
                            href="/auth/signin"
                            className="inline-block px-6 py-3 bg-primary-neon text-dark-bg-primary font-semibold rounded-lg hover:bg-primary-neon-light transition-colors"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg-primary flex items-center justify-center px-4">
            <div className="text-center">
                <Link href="/" className="inline-flex items-center gap-2 mb-8">
                    <Dumbbell className="w-10 h-10 text-primary-neon" />
                    <span className="font-display font-bold text-3xl text-primary-neon">
                        FitHub
                    </span>
                </Link>

                <div className="bg-dark-bg-tertiary rounded-2xl p-8 border border-dark-border">
                    <Loader2 className="w-16 h-16 text-primary-neon mx-auto mb-4 animate-spin" />
                    <h1 className="font-display font-bold text-2xl mb-2 text-dark-text-primary">
                        Authenticating...
                    </h1>
                    <p className="text-dark-text-secondary">
                        Please wait while we complete your sign in.
                    </p>
                </div>
            </div>
        </div>
    );
}
