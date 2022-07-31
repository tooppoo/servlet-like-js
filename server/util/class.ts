import * as path from "path";
import fs from 'fs'

export class Class {
    private static get loader() {
        return new ClassLoader()
    }
    static forName(name: string): Promise<MetaClass> {
        return this.loader.load(name)
    }

    getClassLoader(): ClassLoader {
        return Class.loader
    }
}

type Constructor = new (...args: any[]) => any
class DeclaredConstructor {
    constructor(private readonly c: Constructor) {
    }

    newInstance<Klass>(...args: unknown[]): Klass {
        return new this.c(...args)
    }
}

export class MetaClass {
    constructor(private readonly cons: Constructor) {
    }

    getDeclaredConstructor(): DeclaredConstructor {
        return new DeclaredConstructor(this.cons)
    }
}

export class ClassLoader {
    async load(targetPath: string): Promise<MetaClass> {
        const [modPath, name] = tailAndRest(targetPath.split('.'))
        const mod = await import(path.resolve(this.root, ...modPath))
        const klass = mod[name]

        if (klass !== undefined) {
            return new MetaClass(klass)
        }
        else {
            throw new Error(`${targetPath}#${name} not found`)
        }
    }

    getResourceAsStream(targetPath: string): Promise<string[]> {
        return new Promise((res, rej) => {
            fs.readFile(
                path.resolve(this.root, targetPath),
                { encoding: 'utf-8' },
                (err, data) => {
                    if (err) {
                        return rej(err)
                    } else {
                        res((data || '').split("\n"))
                    }
                }
            )
        })
    }

    private get root(): string {
        return path.resolve(__dirname, '..', '..')
    }
}

const tailAndRest = <T>(xs: T[]): [T[], T] => {
    const [last, ...restRev] = xs.reverse()

    return [restRev.reverse(), last]
}
