/*!
 * CQRS Pattern
 * 
 * Copyright (c) 1984-2026 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 * 
 * Description: UseQuery and UseCommand
 * Date: 2026-08-28
*
*/

export function useCommand(service, handler, appia) {

    const state = useState(handler)

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(
            [...new FormData(e.currentTarget)].map(([key, value]) => [key, value.trim()])
        );
        invoke(service, state, appia, e.currentTarget, formData);
    }

    return {onSubmit}

}

function invoke(service, state, appia, form, request) {

    // Set state
    if (state.isSubmitting()) {
        return;
    } else if (state.canSubmit(form, request)) {
        state.setSubmitting(true);
    } else {
        return;
    }

    // Fetch
    appia
        .fetch(service, 'POST', request)
            .then(response => state.setResponse(response))
            .catch(e => state.setError(e));

}

const useState = (handler) => ({

    submitting:false,

    canSubmit(request) {
        return handler.canSubmit(request);
    },

    setSubmitting(isSubmitting, error) {
        this.submitting=isSubmitting;
        isSubmitting?handler.onSubmit():handler.onUnSubmit(error);
    },

    isSubmitting() {
        return this.submitting;
    },

    setResponse(response) {
        this.setSubmitting(false, false);
        handler.onResponse(response);
    },

    setError(e) {
        this.setSubmitting(false, true);
        handler.onError(e)
    }

})