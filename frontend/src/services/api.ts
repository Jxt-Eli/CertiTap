export type StudentRecord = {
  cardUid: string;
  fullName: string;
  indexNumber: string;
  referenceNumber: string;
  checkedIn: boolean;
};

const mockStudents: StudentRecord[] = [
  {
    cardUid: 'A1B2C3D4',
    fullName: 'Maria Silva',
    indexNumber: 'S1001',
    referenceNumber: 'REF-501',
    checkedIn: false,
  },
  {
    cardUid: 'D2E3F4G5',
    fullName: 'Lucas Mendes',
    indexNumber: 'S1002',
    referenceNumber: 'REF-502',
    checkedIn: true,
  },
];

let cache: StudentRecord[] = [...mockStudents];

export async function fetchStudentByCard(cardUid: string): Promise<StudentRecord | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return cache.find((student) => student.cardUid === cardUid) ?? null;
}

export async function fetchMissingStudents(): Promise<StudentRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return cache.filter((student) => !student.checkedIn);
}

export async function checkInStudent(indexNumber: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const record = cache.find((student) => student.indexNumber === indexNumber);
  if (!record) return false;
  record.checkedIn = true;
  return true;
}

export async function addStudentRecord(student: StudentRecord): Promise<StudentRecord> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  cache = [...cache.filter((item) => item.cardUid !== student.cardUid), student];
  return student;
}
