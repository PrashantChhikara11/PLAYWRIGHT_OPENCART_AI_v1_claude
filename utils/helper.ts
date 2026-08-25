/**
 * Helper utility class with price conversion and fixed test data.
 */
export class Helper {
    /**
     * Remove all characters except digits and the decimal point, then convert to a number.
     */
    static convertPriceToNumber(price: string): number {
        const cleaned = price.replace(/[^0-9.]/g, '');
        return Number(cleaned);
    }

    /**
     * Return fixed product details.
     */
    static getProductDetails() {
        return {
            productName: 'MacBook',
            productQuantity: '1',
            totalPrice: '$602.00',
        };
    }

    /**
     * Return fixed login details.
     */
    static getLoginDetails() {
        return {
            email: 'pavanol@xyz.com',
            password: 'test@123',
        };
    }
}
