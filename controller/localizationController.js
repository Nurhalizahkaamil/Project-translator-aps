const localization = require('../db/models/localization');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');
const fs = require('fs');
const path = require('path');

class LocalizationController {
  static createLocalization = catchAsync(async (req, res, next) => {
    const body = req.body;
    const newLocalization = await localization.create({
      key: body.key,
      translated_text: body.translated_text,
      to_locale: body.to_locale,
    });

    if (!newLocalization) {
      return next(new AppError('Failed to create the localization', 400));
    }

    return success(res, newLocalization, 'Localization created');
  });

  static getAllLocalization = catchAsync(async (_req, res, next) => {
    const result = await localization.findAll();

    if (!result || result.length === 0) {
      return next(new AppError('Data not found', 404));
    }

    return success(res, result, 'Localization found');
  });

  static updateLocalization = catchAsync(async (req, res, next) => {
    const localizationId = req.params.id;
    const body = req.body;

    const result = await localization.findOne({
      where: { id: localizationId },
    });

    if (!result) {
      return next(new AppError('Invalid localization id', 400));
    }

    const updateResult = await result.update(body);

    return success(res, updateResult, 'Localization updated');
  });

  static deleteLocalization = catchAsync(async (req, res, next) => {
    const localizationId = req.params.id;

    const result = await localization.findOne({
      where: { id: localizationId },
    });

    if (!result) {
      return next(new AppError('Invalid localization id', 400));
    }

    await result.destroy();

    return success(res, null, 'Data Successfully Deleted');
  });

  static addTranslation = catchAsync(async (req, res, next) => {
    const { key, locale, text } = req.body;
    try {
      let translation = await localization.findOne({ where: { key } });

      if (!translation) {
        translation = await localization.create({ key, translated_text: text, to_locale: locale });
      } else {
        translation.translated_text = text;
        translation.to_locale = locale;
        await translation.save();
      }

      let responseData = {};
      responseData[`add ${locale === "id" ? "Indonesian" : "English"} data`] = text;

      return success(res, responseData, `Create key: ${key}, locale: ${locale}, text: ${text}`);
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  });

  static getTranslation = catchAsync(async (req, res, next) => {
    const { key, locale, text } = req.query;
    try {
      let translation;

      if (key && locale) {
        translation = await localization.findOne({ where: { key, to_locale: locale } });

        if (!translation) {
          return res.status(200).json({
            status: '204 not found',
            message: `The data with key "${key}" and locale "${locale}" not found in database`
          });
        }

        return success(res, translation.translated_text, 'Translation found');
      }

      if (key && !locale) {
        translation = await localization.findOne({ where: { key } });

        if (!translation) {
          return res.status(200).json({
            status: '204 not found',
            message: `The data with key "${key}" not found in database`
          });
        }

        return success(res, { [key]: translation.translated_text }, 'Translation found for key');
      }

      if (locale) {
        const translations = await localization.findAll({ where: { to_locale: locale } });

        if (!translations || translations.length === 0) {
          return res.status(200).json({
            status: '204 not found',
            message: `The data with locale "${locale}" not found in database`
          });
        }

        const result = {};
        translations.forEach(t => {
          result[t.key] = t.translated_text;
        });

        return success(res, result, 'Translations found for locale');
      }

      return next(new AppError('Please provide either key or locale to search for translations', 400));
    } catch (err) {
      return next(new AppError(`Error fetching translations: ${err.message}`, 500));
    }
  });

  static saveJsonToDatabase = catchAsync(async (_req, res, next) => {
    const filePath = path.join(__dirname, '../data.json'); // Adjust the path accordingly
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        return next(new AppError('Failed to read JSON file', 500));
      }

      try {
        const jsonData = JSON.parse(data);
        const entries = Object.entries(jsonData);

        for (const [key, translations] of entries) {
          for (const [locale, translated_text] of Object.entries(translations)) {
            if (!key || !locale || !translated_text) {
              console.error(`Invalid data: key=${key}, locale=${locale}, translated_text=${translated_text}`);
              continue; // Skip invalid entries
            }

            console.log(`Key: ${key}, Locale: ${locale}, Translated Text: ${translated_text}`); // Debugging

            await localization.upsert({
              key,
              to_locale: locale,
              translated_text,
            });
          }
        }

        return success(res, null, 'JSON data uploaded to database');
      } catch (parseError) {
        return next(new AppError('Failed to parse JSON data', 500));
      }
    });
  });
}

module.exports = { LocalizationController };
