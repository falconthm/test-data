import type {
  Json,
  TTransformer,
  TTransformerOptions,
  TBuilder,
  TTransformType,
} from './types';

import { buildField, buildFields } from './helpers';

function Transformer<Model extends Json, TransformedModel>(
  transformType: TTransformType,
  transformOptions: TTransformerOptions<Model, TransformedModel>
): TTransformer<Model> {
  function transform(fields: Model) {
    let transformedFields = { ...fields };
    const fieldsReplacer = transformOptions?.replaceFields;
    const fieldsAdder = transformOptions?.addFields;
    const fieldsToRemove = transformOptions?.removeFields;
    const fieldsToBuild = transformOptions?.buildFields;

    if (fieldsToBuild) {
      fieldsToBuild.forEach((fieldToBuild) => {
        const field = transformedFields[fieldToBuild] as TBuilder<Model>;
        // Build only fields that are not null or undefined
        if (field) {
          transformedFields = {
            ...transformedFields,
            [fieldToBuild]: Array.isArray(field)
              ? buildFields<Model>(field, transformType, {
                  fieldToBuild,
                })
              : buildField<Model>(field, transformType, {
                  fieldToBuild,
                }),
          };
        }
      });
    }

    // The default transformer only allows building nested fields to not
    // allow re-transforming model shape
    if (transformType === 'default') {
      return (transformedFields as unknown) as TransformedModel;
    }

    // If this is defined, all other options are ignored, as the transformed value
    // can be anything (object, array, scalar, etc.).
    if (fieldsReplacer) {
      if (fieldsAdder) {
        console.warn(
          `The "replaceFields" option takes precedence over the "addFields" option, making it unsed.`
        );
      }
      if (fieldsToRemove) {
        console.warn(
          `The "replaceFields" option takes precedence over the "removeFields" option, making it unsed.`
        );
      }
      return (fieldsReplacer({ fields }) as unknown) as TransformedModel;
    }

    if (fieldsAdder) {
      const fieldsToAdd = fieldsAdder({ fields });
      Object.entries(fieldsToAdd).forEach(([fieldName, fieldValue]) => {
        if (transformedFields[fieldName]) return;
        transformedFields = {
          ...transformedFields,
          [fieldName]: fieldValue,
        };
      });
    }

    if (fieldsToRemove) {
      fieldsToRemove.forEach((fieldToRemove) => {
        delete transformedFields[fieldToRemove];
      });
    }

    return (transformedFields as unknown) as TransformedModel;
  }

  return { type: transformType, transform };
}

export default Transformer;
