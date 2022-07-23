import * as path from "path";

export class ClassLoader {
    private readonly root: string

    constructor(root?: string) {
        this.root = root || path.resolve(__dirname, '..', '..')
    }

    async load(targetPath: string, name: string = 'default'): Promise<DynamicClass> {
        const mod = await import(path.resolve(this.root, targetPath))
        const klass = mod[name]

        if (klass !== undefined) {
            return new DynamicClass(klass)
        }
        else {
            throw new Error(`${targetPath}#${name} not found`)
        }
    }
}

class DynamicClass {
    constructor(private readonly klass: new () => unknown) {}

    newInstance<T>(): T {
        return new this.klass() as any
    }
}
