import { toast as sonnerToast } from 'sonner';

type ToastState = {
	message: string;
	type: string;
} | null;

const useToast = () => {
	const showToast = (message: string, type: string) => {
		const notify = sonnerToast[type as keyof typeof sonnerToast]
		if (typeof notify === 'function') {
			notify(message)
			return
		}
		sonnerToast(message)
	};

	const hideToast = () => {
		sonnerToast.dismiss();
	};

	return [showToast, hideToast];
};

export default useToast;
