/** ## Remove property from object
 * The function that removes object property
 * @param object initial object
 * @param property removable property
 * @returns new object without `property`
 */
export const removeProperty = <T>(object: T, property: string) => {
	const result: any = {};

	for (const key in object) {
		if (key !== property) {
			result[key] = object[key];
		}
	}

	return result;
};
