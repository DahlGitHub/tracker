export interface Exercise {
    value: string;
    label: string;
}

export const exerciseOptions: Exercise[] = [
    { label: 'Treadmill', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Ftreadmill.webp?alt=media&token=f1f2ffe1-2f9e-436a-b19e-7d8fc4431c5b'},

    { label: 'Hammer Curl (Dumbbell)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fhammer-curl.webp?alt=media&token=4fc41a0e-4801-4847-a7aa-80a23babb75a'},
    { label: 'Triceps Pushdown', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Ftriceps-pushdown.webp?alt=media&token=a72c66d4-0291-4615-a721-b356bc79df05'},
    { label: 'EZ Bar Bicep Curl', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fez-barbell-curl.webp?alt=media&token=ce97e417-ed63-4dcf-8744-219938a08c66'},
    { label: 'Tricep Rope Pushdown', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fcable-one-arm-triceps-pushdown.webp?alt=media&token=bef3dfd0-97ce-4422-be86-dcd31079835b'},
    { label: 'Wrist Roller', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fwrist-reverse-curl.webp?alt=media&token=345de1ce-6abb-4b5b-a0bd-f47490bdf6c3'},

    { label: 'Chest Press (Machine)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Flever-chest-press.webp?alt=media&token=5e89dbd1-4d74-4606-9674-98d74f19ec68'},
    { label: 'Bench Press (Dumbbell)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fdumbbell-bench-press.webp?alt=media&token=fd3930aa-323e-4ca3-b3ec-736a00152645'},
    { label: 'Incline Bench Press (Dumbbell)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fdumbbell-incline-bench-press.webp?alt=media&token=0e9feceb-0bc1-4d5d-b858-500998226ed0'},
    { label: 'Cable Fly Crossovers', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fcable-fly.webp?alt=media&token=608628e3-68e2-4fc1-9ddc-3425c041293e'},
    { label: 'Lateral Raise (Dumbbell)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Flateral-raise.webp?alt=media&token=c06d6d11-aca6-4341-9880-900af55cc683'},
    { label: 'Shoulder Press (Dumbbell)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fshoulder-press.webp?alt=media&token=5c5f8685-68fb-440d-873b-fc079c6bcacc'},
    { label: 'Shrug (Dumbbell)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fshrugs.webp?alt=media&token=fb689c15-cacb-41a7-8d43-1cd4182ee166'},
    { label: 'Shoulder Press (Machine)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Flever-shoulder-press.webp?alt=media&token=1788b395-cfd0-438c-a7e3-36a424f06490'},

    { label: 'Deadlift (Barbell)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fdeadlift.webp?alt=media&token=5f749efd-a718-4bad-9c0f-4e23cb60be29'},
    { label: 'Leg Extension (Machine)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Flever-leg-extension.webp?alt=media&token=f5a850b4-e1c2-41c0-8b4a-766d54339ff9'},
    { label: 'Seated Leg Curl (Machine)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fleg-curl.webp?alt=media&token=6f0e4537-bbdc-4df2-b0a7-8319604b1fa5'},
    { label: 'Sled Leg Press (Machine)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fsled-leg-press.webp?alt=media&token=3396567c-ea53-4d74-b81d-aa4ac0b51eaf'},
    { label: 'Standing Calf Raise (Smith)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fsmith-calf-raise.webp?alt=media&token=ec1482f8-6515-451c-aae3-6840fcf0d14f'},
    { label: 'Squat (Smith Machine)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fsmith-squat.webp?alt=media&token=4573d2dc-bd7f-4b5e-8e8c-a7d88fc132af'},
    { label: 'Bulgarian Split Squat', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fbulgarian-split.webp?alt=media&token=91c7a75c-e5a9-42cd-a7e0-f4b78e21b9a7'},

    { label: 'Rack Pull', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Frack-pull.webp?alt=media&token=cf7dc4dd-9b54-4320-af2f-5bf820df53ce'},
    { label: 'Lat Cable Pulldown', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fpulldown.webp?alt=media&token=55e12602-ef4f-4fe5-b77a-2ce2842a44f0'},
    { label: 'Lat Cable Pulldown (V Grip)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fv-bar-lat-pulldown.webp?alt=media&token=743e6cb5-9920-4359-b839-3e43804f936d'},
    { label: 'Seated Cable Row (V Grip)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fv-grip-seated-row.webp?alt=media&token=38a4004f-3ee8-4681-be13-9af83ff7c531'},
    { label: 'Seated Cable Row (Wide Grip)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fwide-grip-seated-row.webp?alt=media&token=790f2758-6557-4d27-85a4-99e351e96c03'},
    { label: 'Face Pull (Cable)', value: 'https://firebasestorage.googleapis.com/v0/b/tracker-d2773.appspot.com/o/images%2Fexercises%2Fface-pull-rope.webp?alt=media&token=1d1d7d06-e6a2-4bed-a1d1-cbc4e5e23903'},

];
