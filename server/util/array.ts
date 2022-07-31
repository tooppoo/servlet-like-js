
export const tailAndRest = <T>(xs: T[]): [T[], T] => {
    const [last, ...restRev] = xs.reverse()

    return [restRev.reverse(), last]
}
