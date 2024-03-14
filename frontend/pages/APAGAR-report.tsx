// pages/Report-page.tsx
import React, { useState } from 'react';
import { TableComponent } from '../src/components/TableComponent';
import http from '../src/api/http';
//import style from './ModalGrades.module.scss';
import { useColumns } from '../src/screens/Teacher/Reports/hooks/useColumns';
import { useFieldsMobile } from '../src/screens/Teacher/Reports/hooks/useFieldsMobile';

interface PageProps {
  data: ReportData;
}

const [loadingGetGrades, setLoadingGetGrades] = useState(true);
const fieldsMobile = useFieldsMobile();

interface Offer {
  _id: string;
  tithing: number;
  offer: number;
  teacher: string;
  student: string;
  subject: string;
  createdAt: string;
  __v: number;
}

interface ReportData {
  count: number;
  offerList: Offer[];
}


const ReportPage: React.FC<PageProps> = ({ data }) => {
  const columns = useColumns({
    handleDeleteSubject: (subject) => {
      // Implement your logic for deleting a subject
    },
    handleAddStudents: (subject) => {
      // Implement your logic for adding students to a subject
    },
    handleShowGrades: (subject) => {
      // Implement your logic for showing grades of a subject
    },
  });


  return (
    <div className={'custom-container'}>
      <TableComponent
        rows={data.offerList}
        loading={loadingGetGrades}
        columns={columns}
        emptyText="Nenhum aluno cadastrado na turma"
      />
    </div>
  );
};

export async function getStaticProps() {
  setLoadingGetGrades(true);
  try {
    const jsonData = await http.get('/class-offer?viewAll=true');
    setLoadingGetGrades(false);
    return {
      props: {
        data: jsonData.data.data,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        data: { count: 0, offerList: [] },
      },
    };
  }
}

export default ReportPage;
