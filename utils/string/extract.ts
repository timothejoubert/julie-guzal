// value: 'XYZ 123 ABC 456 ABC 789 ABC'
// substring: 'ABC'
// index: 2
// return 16
export function getPosition(value: string, subString: string, index: number) {
    return value.split(subString, index).join(subString).length
}

// value: '/mon-url/sub-page/sub-sub-page'
// substring: '/'
// index: [2,3]
// return sub-page
export function extractValueBetweenOccurrence(value: string, subString: string, indexes: [number, number]) {
    return value.substring(getPosition(value, subString, indexes[0]) + 1, getPosition(value, subString, indexes[1]))
}
