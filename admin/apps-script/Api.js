/**
 * Web app entry point and the functions the UI calls through google.script.run.
 *
 * Results are plain JSON-safe objects. Validation problems come back as
 * {ok: false, errors: {field: message}} because google.script.run drops
 * custom error properties; unexpected problems are thrown as Errors whose
 * message is shown to the owner.
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Ul-ji Admin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/** Inlines another HTML file from a template: <?!= include('Styles') ?> */
function include(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function eventSchema(type) {
  const schema = EVENT_SCHEMAS[type];
  if (!schema) throw new Error('Tipo de evento desconocido: "' + type + '"');
  return schema;
}

function withDateInput(record) {
  return Object.assign({}, record, { dateInput: sheetDateToInput(record.fecha || record.date) });
}

function listEvents(type) {
  const schema = eventSchema(type);
  return readRecords(openSheet(schema), schema).map(withDateInput);
}

/** Tries to rebuild the site; a failure never undoes the saved data. */
function requestPublish() {
  try {
    triggerRebuild();
    return { triggered: true };
  } catch (e) {
    return { triggered: false, warning: 'Los datos se guardaron, pero no se pudo pedir la publicación: ' + e.message };
  }
}

function saveEvent(type, data) {
  const schema = eventSchema(type);
  const check = validateEvent(type, data);
  if (!check.ok) return { ok: false, errors: check.errors };

  const id = data && data.id ? String(data.id) : '';
  const record = withLock(function () {
    const sheet = openSheet(schema);
    return id ? updateRecord(sheet, schema, id, check.values) : appendRecord(sheet, schema, check.values);
  });
  return { ok: true, record: record, publish: requestPublish() };
}

function deleteEvent(type, id) {
  const schema = eventSchema(type);
  withLock(function () { deleteRecord(openSheet(schema), schema, String(id)); });
  return { ok: true, publish: requestPublish() };
}

function listPhotos() {
  return readRecords(openSheet(PHOTO_SCHEMA), PHOTO_SCHEMA).map(withDateInput);
}

function savePhoto(data) {
  const input = Object.assign({}, data);
  // A new upload arrives with an empty thumbnail; derive it from the full-size image
  if (!input.thumbnail && input.fullSize) input.thumbnail = thumbnailUrl(String(input.fullSize));
  const check = validatePhoto(input);
  if (!check.ok) return { ok: false, errors: check.errors };

  const id = input.id ? String(input.id) : '';
  const record = withLock(function () {
    const sheet = openSheet(PHOTO_SCHEMA);
    return id ? updateRecord(sheet, PHOTO_SCHEMA, id, check.values) : appendRecord(sheet, PHOTO_SCHEMA, check.values);
  });
  // Photos are read live by the site: no rebuild needed
  return { ok: true, record: record };
}

function deletePhoto(id, alsoDeleteAsset) {
  const photoId = String(id);
  const row = withLock(function () {
    const sheet = openSheet(PHOTO_SCHEMA);
    const existing = readRecords(sheet, PHOTO_SCHEMA).filter(function (r) { return r.id === photoId; })[0];
    deleteRecord(sheet, PHOTO_SCHEMA, photoId);
    return existing;
  });
  if (!alsoDeleteAsset) return { ok: true, assetDeleted: false };

  const publicId = row ? publicIdFromUrl(row.fullSize) || publicIdFromUrl(row.thumbnail) : null;
  if (!publicId) {
    return { ok: true, assetDeleted: false, warning: 'Se borró la fila, pero no se pudo identificar la imagen en Cloudinary.' };
  }
  try {
    destroyAsset(publicId);
    return { ok: true, assetDeleted: true };
  } catch (e) {
    return { ok: true, assetDeleted: false, warning: 'Se borró la fila, pero la imagen sigue en Cloudinary. ' + e.message };
  }
}
