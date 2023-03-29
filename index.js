module.exports = function getI18nText({ stringTokens, variables, translations, locale }) {
    let i18nText = '';

    for (const token of stringTokens) {
        if (typeof token === 'string') {
            if (token.startsWith('#')) {
                const key = token.slice(1);
                i18nText += translations[locale][key] || key;
            } else if (token.startsWith('$')) {
                const varName = token.slice(1);
                i18nText += variables[varName];
            } else {
                i18nText += token;
            }
        } else if (Array.isArray(token)) {
            const [funcName, ...args] = token;
            let value;

            switch (funcName) {
                case '@date':
                    value = new Intl.DateTimeFormat(locale, {
                        dateStyle: 'full',
                        timeStyle: 'long',
                    }).format(new Date(args[0]));
                    break;
                case '@number':
                    const numValue = args[0].startsWith('$') ? variables[args[0].slice(1)] : args[0];
                    if (args.length === 2) {
                        value = new Intl.NumberFormat(locale, {
                            style: 'currency',
                            currency: args[1],
                        }).format(numValue);
                    } else {
                        value = new Intl.NumberFormat(locale).format(numValue);
                    }
                    break;
                case '@plural':
                    const key = args[0].slice(1);
                    const number = args[1].startsWith('$') ? variables[args[1].slice(1)] : args[1];
                    const pluralRules = new Intl.PluralRules(locale);
                    const pluralForm = pluralRules.select(number);
                    value = `${number}${translations[locale][key][pluralForm]}`;
                    break;
                case '@list':
                    const listFormat = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' });
                    const items = args.map((item) => (item.startsWith('$') ? variables[item.slice(1)] : item.startsWith('#') ? translations[locale][item.slice(1)] : item));
                    value = listFormat.format(items);
                    break;
                case '@relativeTime':
                    const rtFormat = new Intl.RelativeTimeFormat(locale);
                    value = rtFormat.format(args[0], args[1]);
                    break;
                default:
                    value = `[Unknown function: ${funcName}]`;
            }
            i18nText += value;
        }
    }

    return i18nText;
}
