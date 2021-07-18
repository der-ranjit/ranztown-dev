export function GetEnumMemberNames(someEnum: any): string[] {
    const result: string[] = [];
    for (let enumMember in someEnum) {
        var isValueProperty = parseInt(enumMember, 10) >= 0
        if (isValueProperty) {
           result.push(someEnum[enumMember]);
        }
     }
     return result;
}
