import {ClassLoader} from "@util/class-loader";
import * as path from "path";

const root = path.resolve(__dirname, '..', '..')

interface IServletClassLoader {
    app: ClassLoader
    servlet: ClassLoader
}
export const ServletClassLoader: IServletClassLoader = {
    app: new ClassLoader(
        path.resolve(root, 'app')
    ),
    servlet: new ClassLoader(
        path.resolve(root, 'server', 'servlet')
    )
}
