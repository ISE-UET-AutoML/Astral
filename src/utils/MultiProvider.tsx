import React from "react";

type MultiProviderProps = {
    providers: React.ReactElement[];
    children: React.ReactNode;
};

export const MultiProvider = (props: MultiProviderProps) => {
    let content = props.children || null;

    /* Error/Validation */
    if (!props.providers) {
        throw new Error("MultiProvider: Missing providers prop");
    }

    if (!props.children) {
        throw new Error("MultiProvider: Missing children");
    }

    // Turn object into an array
    // const numberOfProviders = props.providers.size;
    const numberOfProviders = props.providers.length;

    if (!numberOfProviders) {
        // Providers prop is empty, r
        return content;
    }

    [...(props.providers ?? [])].reverse().forEach((provider) => {
        content = React.cloneElement(provider, undefined, content);
    });

    return content;
};
