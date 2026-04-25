import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import React from "react";

type LibraryConfig = {
    scriptSrc?: string;
    cssSrc?: string;
    checkAvailability: () => unknown;
};

type Libraries = Record<string, LibraryConfig>;

type LibraryContextValue = {
    requestLibrary: (libraryName: string) => Promise<unknown>;
};

const libraryQueue = new Map<string, Set<() => void>>();

const libRequest = new Map<string, Promise<void>>();

const requestLabelStudio = (libraries: Libraries) => async (library: string) => {
    const { scriptSrc, cssSrc, checkAvailability } = libraries[library];
    const availableLibrary = checkAvailability();

    const queueSet = libraryQueue.get(library) ?? new Set();
    libraryQueue.set(library, queueSet);

    if (availableLibrary) return availableLibrary;

    const requestResolver = new Promise((resolve) => {
        queueSet.add(() => {
            setTimeout(() => {
                resolve(checkAvailability());
            }, 10);
        });
    });

    if (!libRequest.has(library)) {
        libRequest.set(
            library,
            (async () => {
                const assets = [];

                if (scriptSrc) {
                    assets.push(
                        new Promise<void>((resolve) => {
                            const script = document.createElement("script");
                            script.type = "text/javascript";
                            script.onload = () => {
                                resolve();
                            };
                            script.src = scriptSrc;
                            script.dataset.replaced = "true";
                            document.head.appendChild(script);
                        }),
                    );
                }

                if (cssSrc) {
                    assets.push(
                        new Promise<void>((resolve) => {
                            const link = document.createElement("link");
                            link.rel = "stylesheet";
                            link.type = "text/css";
                            link.onload = () => {
                                resolve();
                            };
                            link.href = cssSrc;
                            link.dataset.replaced = "true";
                            document.head.appendChild(link);
                        }),
                    );
                }

                await Promise.all(assets);

                queueSet.forEach((resolver) => resolver());
            })(),
        );
    }

    return requestResolver;
};

export const LibraryContext = createContext<LibraryContextValue>({
    requestLibrary: async () => undefined,
});

export const LibraryProvider = ({
    libraries,
    children,
}: {
    libraries: Libraries;
    children?: React.ReactNode;
}) => {
    const requestLibrary = useMemo(() => {
        return requestLabelStudio(libraries);
    }, [libraries]);

    return <LibraryContext.Provider value={{ requestLibrary }}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (libraryName: string) => {
    const ctx = useContext(LibraryContext);
    const [library, setLibrary] = useState<boolean>();

    const fetchLibrary = useCallback(async () => {
        const libLoaded = await ctx.requestLibrary(libraryName);

        setLibrary(!!libLoaded);
    }, [ctx, libraryName]);

    useEffect(() => {
        fetchLibrary();
    }, [fetchLibrary]);

    return library;
};
