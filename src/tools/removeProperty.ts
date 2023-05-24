/** ## Remove property from object
 * The function that removes object property
 * @param object initial object
 * @param property removable property
 * @returns new object without `property`
 */
export const removeProperty = <T, K extends keyof T>(object: T, ...properties: K[]): Omit<T, K> => {
	const result: Partial<T> = { ...object };

	properties.forEach((property) => {
		delete result[property];
	});

	return result as Omit<T, K>;
};
