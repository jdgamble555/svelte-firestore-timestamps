import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { firestore } from 'firebase-functions';

const PATH = 'todos/{docID}'


exports.createdAtTrigger = firestore
    .document(PATH)
    .onCreate(async (change) => {

        // update createdAt timestamp
        change.ref.update({
            createdAt: FieldValue.serverTimestamp()
        });
    });

exports.updatedAtTrigger = firestore
    .document(PATH)
    .onUpdate(async (change) => {

        const after = change.after.exists ? change.after.data() : null;
        const before = change.before.exists ? change.before.data() : null;

        // don't update if creating createdAt
        if (!before?.createdAt && after?.createdAt) {
            return;
        }

        // don't update if creating updatedAt
        if (!before?.updatedAt && after?.updatedAt) {
            return;
        }

        // don't update if updating updatedAt
        if (before?.updatedAt && after?.updatedAt) {
            if (!(before.updatedAt as Timestamp).isEqual(after.updatedAt)) {
                return;
            }
        }

        // update updatedAt timestamp
        change.after.ref.update({
            updatedAt: FieldValue.serverTimestamp()
        });
    });

/*
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';

const PATH = 'todos/{docID}'

exports.createdAtTrigger = onDocumentCreated(PATH, (event) => {

    // update createdAt timestamp
    event.data?.ref.update({
        createdAt: FieldValue.serverTimestamp()
    });

});

exports.updatedAtTrigger = onDocumentUpdated(PATH, (event) => {

    const after = event.data?.after.exists ? event.data.after.data() : null;
    const before = event.data?.before.exists ? event.data.before.data() : null;

    // don't update if creating createdAt
    if (!before?.createdAt && after?.createdAt) {
        return;
    }

    // don't update if creating updatedAt
    if (!before?.updatedAt && after?.updatedAt) {
        return;
    }

    // don't update if updating updatedAt
    if (before?.updatedAt && after?.updatedAt) {
        if (!(before.updatedAt as Timestamp).isEqual(after.updatedAt)) {
            return;
        }
    }

    // update updatedAt timestamp
    event.data?.after.ref.update({
        updatedAt: FieldValue.serverTimestamp()
    });

});
*/