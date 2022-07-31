
export class Properties {
    private map: Map<string, string> = new Map()

    load(stream: string[]): void {
        stream.forEach((row: string) => {
            const [key, value] = row.split('=')

            if (key === undefined || value === 'undefined') {
                throw new Error(`${row} is invalid format`)
            }

            this.map.set(key, value)
        })
    }

    getProperty(path: string): string {
        const prop = this.map.get(path)

        if (prop) {
            return prop
        } else {
            throw new Error(`property ${path} not found`)
        }
    }

    contains(path: string): boolean {
        return this.map.has(path)
    }
}
