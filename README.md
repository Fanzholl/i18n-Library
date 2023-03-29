# i18n-Library
"Библиотека i18n" Яндекс.Контест

```
Ограничение времени	1 секунда
Ограничение памяти	64Mb
Ввод	input.js
Вывод	output.txt
В целях борьбы с разрастающимся бандлом приложения, вам поставили задачу переписать логику интернационализации в легаси проекте. Чтобы удалить старую библиотеку интернационализации вам нужно написать функцию getI18nText, которая будет повторять логику старой библиотеки, но с использованием Intl API.
Старый фреймворк имел следующую логику.

Параметры функции
/**  
 * @param stringTokens - описание строки которую нужно интернационализировать.  
 * @param variables - значение переменных  
 * @param translations - объект с переводами  
 * @param locale - локаль  
 */  
getI18nText({stringTokens, variables, translations, locale})

stringTokens
Текст, который нужно интернационализировать, описывается в JSON-like конфиге, в котором могут встретиться следующие сущности:

#price - ключ перевода, в данном случае "price"
$tripDays - переменная, в данном случае "tripDays"
@date - функции, в данном случае "date". Функции описываются как массив в котором на первом месте стоит имя функции, а все остальные значения в массиве это параметры функции.
Пример:

const stringTokens = [  
    "#price",                          // ключ перевода price  
    " ",                               // неизменяемый текст  
    ["@plural", "#day", "$tripDays"],  // функция плюрализации, в которую передаётся ключ перевода и переменная в качестве числового значения  
    " - ",                             // неизменяемый текст  
    ["@number", "$tripPrice", "USD"]   // функция интернационализации, в которую  передаётся число в качестве переменной и валюта  
];
variables
Переменные передаются как объект.
Пример:

const variables = {  
  tripDays: 10,  
  tripPrice: 56789.01,  
}
translations
Переводы передаются как JSON cо следующей структурой:

const translations = {  
  "ru-RU" : {             // локаль  
    price: "Цена",        // обычный перевод  
    day: {                // c учетом плюральных форм  
        zero: " дней",  
        one: " день",  
        few: " дня",  
        many: " дней",  
        other: " дней",  
    }  
  },  
  "en-US": {  
      price: "Price",  
      day: {  
          one: " day",  
          other: " days",  
          //...  
        }  
  },  
  //...  
}
Cписок функций которые требуется поддержать
@date
Функция интернационализации даты. Может принимать как число(timestamp), так и строку.
Сигнатура: "@date(value)"
Пример описания функции в конфиге:

getI18nText({  
  stringTokens: [["@date", 1676561884561]],  
  locale: "ru-RU",  
}) // четверг, 16 февраля 2023 г., 15:38:04 UTC
@number
Функция интернационализации чисел и валюты.
Cигнатура: "@number(value, [currency])"

Если нет "currency то возвращает отформатированное число
Если есть "currency то возвращает отформатированное число с валютой
getI18nText({  
  stringTokens: [["@number", 56789.01, "USD"]],  
  locale: "ru-RU",  
}) // 56 789,01 $
@plural
Функция плюрализации.
Сигнатура: "@plural(key, number)"
Возвращает строку с отформатированным по правилам интернационализации числом и ключом

getI18nText({  
  stringTokens: [["@plural", "#day", "$tripDays"]],  
  variables: { tripDays: 434.5 },  
  translations: {  
    "ru-RU": {  
      day: {  
        zero: " дней",  
        one: " день",  
        few: " дня",  
        many: " дней",  
        other: " дней",  
      },  
    }  
    // ...  
  },  
  locale: "ru-RU",  
}) // "434,5 дня"
@list
Функция интернационализации перечеслений.
Сигнатура: "@list(...args)"
Возвращет "conjunction"список.

getI18nText({  
  stringTokens: [["@list", "Motorcycle", "$item", "#bus"]],  
  variables: { item: "Car" },  
  translations: {  
    "en-US": {  
        bus: "Bus",  
    },  
    // ...  
  },  
  locale: "en-US",  
}) // "Motorcycle, Car, and Bus"
@relativeTime
Функция интернационализации относительного времени.
Сигнатура: "@relativeTime(value, unit)"

getI18nText({  
  stringTokens: [["@relativeTime", -5, "hours"]],  
  locale: "ru-RU",  
}) // 5 часов назад
Пример работы
const stringTokens = [  
    "#price",  
    " ",  
    ["@plural", "#day", "$tripDays"],  
    " - ",  
    ["@number", "$tripPrice", "USD"]  
];  
 
 
const variables = {  
  tripDays: 10,  
  tripPrice: 56789.01,  
}  
 
const translations = {  
  "ru-RU" : {             // локаль  
    price: "Цена",        // обычный перевод для ключа price  
    day: {                // перевод для ключа day c учетом плюральных форм  
        zero: " дней",  
        one: " день",  
        few: " дня",  
        many: " дней",  
        other: " дней",  
    }  
  },  
  "en-US": {  
      price: "Price",  
      day: {  
          one: " day",  
          other: " days",  
          //...  
        }  
  },  
  //...  
}  
 
getI18nText({stringTokens, variables, translations, locale: "ru-RU"}) //  "Цена 10 дней - 56 789,01 $"  
getI18nText({stringTokens, variables, translations, locale: "en-US"}) //  "Price 10 days - $56,789.01"
Шаблон кода
module.exports = function getI18nText({ stringTokens, variables, translations, locale }) {  
   // ваш код здесь  
 
  return i18nText // строка  
}
Пример 1
Ввод	Вывод
module.exports = [
    ["key", " ", "$var", " ", "#translation"],
    { var: 100 },
    {
        "ru-RU": { translation: "тест" },
        "en-US": { translation: "test" },
        "de-DE": { translation: "prüfen" },
        "hi-IN": { translation: "परीक्षा" },
        "ar-AA": { translation: "امتحان" },
    },
]
key 100 тест
key 100 test
key 100 prüfen
key 100 परीक्षा
key 100 امتحان
Пример 2
Ввод	Вывод
module.exports = [
    [["@number", "$var", "USD"]],
    { var: 123456789.0123 },
    {},
]
123 456 789,01 $
$123,456,789.01
123.456.789,01 $
$12,34,56,789.01
١٢٣٬٤٥٦٬٧٨٩٫٠١ US$
Примечания
Для проверки будет использоваться node.js 18 версии. На более старых версиях ответы могут отличаться:
// Timestamp date  
module.exports = [  
    [["@date", 1676561884561]],  
    {},  
    {},  
]  
 
// node@19.2.0  
// четверг, 16 февраля 2023 г. в 18:38:04 GMT+3  
 
// node@14.17.5  
// четверг, 16 февраля 2023 г., 18:38:04 GMT+3  
//```
