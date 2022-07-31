import {ClassLoader} from "@util/class";
import * as path from "path";

const root = path.resolve(__dirname, '..', '..')

interface IServletClassLoader {
    app: ClassLoader
}
export const ServletClassLoader: IServletClassLoader = {
    app: new ClassLoader(
        path.resolve(root, 'app')
    ),
}
