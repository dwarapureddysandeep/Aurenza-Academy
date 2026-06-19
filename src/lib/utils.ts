export function parseBatchData(batch: any, courses: any[] = [], trainers: any[] = []) {
  let isJson = false;
  let parsed: any = {};
  
  try {
    if (batch && batch.timeSlot && batch.timeSlot.trim().startsWith('{')) {
      parsed = JSON.parse(batch.timeSlot);
      isJson = true;
    }
  } catch (e) {
    // ignore
  }
  
  const courseSource = parsed.courseSource || 'existing';
  const trainerSource = parsed.trainerSource || 'existing';
  
  const course = courses.find((c: any) => c.id === batch.courseId);
  const trainer = trainers.find((t: any) => t.id === batch.trainerId);
  
  const courseName = parsed.customCourseName || (course ? course.name : 'Professional Certification');
    
  const categoryName = course ? course.categoryName : 'Professional Certification';
  
  const trainerName = parsed.customTrainerName || (trainer ? trainer.name : 'Rahul Sharma');
    
  const trainerSpecialty = trainerSource === 'custom'
    ? 'Industry Specialist Mentor'
    : (trainer ? trainer.specialty : 'Ex-Amazon Senior Architect');

  const batchType = parsed.batchType || 'Weekend'; // Weekend / Weekday / Fast Track / Corporate
  const trainingMode = parsed.trainingMode || 'Online Classroom'; // Online Classroom / Self-Paced / Corporate Training
  const startDate = parsed.startDate || batch.startDate || 'Upcoming';
  const endDate = parsed.endDate || '';
  const timeZone = parsed.timeZone || 'IST';
  const classTiming = parsed.classTiming || (isJson ? '' : batch.timeSlot) || 'Flexible Slot';
  const status = parsed.status || 'Upcoming'; // Upcoming / Ongoing / Completed
  const notes = parsed.notes || '';
  
  return {
    courseName,
    categoryName,
    trainerName,
    trainerSpecialty,
    batchType,
    trainingMode,
    startDate,
    endDate,
    timeZone,
    classTiming,
    status,
    notes,
    courseSource,
    trainerSource
  };
}
