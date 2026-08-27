export function useCommand(service, handler, appia) {

    const state = useState(handler)

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));
        invoke(service, state, appia, formData);
    }

    return {onSubmit}

}

function invoke(service, state, appia, request) {

    // Set state
    if (state.isSubmitting()) {
        return;
    } else {
        state.setSubmitting(true);
    }

    // Fetch
    appia
        .fetch(service, 'POST', request)
            .then(response => state.setResponse(response))
            .catch(e => state.setError(e));

}

const useState = (handler) => ({

    submitting:false,

    setSubmitting(isSubmitting, response) {
        this.submitting=isSubmitting;
        isSubmitting?handler.onSubmit():handler.onUnSubmit(response);
    },

    isSubmitting() {
        return this.submitting;
    },

    setResponse(response) {
        this.setSubmitting(false, response);
        handler.onResponse(response);
    },

    setError(e) {
        this.setSubmitting(false);
        handler.onError(e)
    }

})