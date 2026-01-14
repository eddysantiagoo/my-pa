import { Config, Input, RouteParam, RouteParamsWithQueryOverload, RouteParams } from 'ziggy-js';

declare global {
    function route(
        name?: string,
        params?: RouteParamsWithQueryOverload | RouteParam,
        absolute?: boolean,
        config?: Config,
    ): string;
}

export { };
