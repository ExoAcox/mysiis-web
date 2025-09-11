// index.test.tsx
import { describe, test } from 'vitest'
import { axios, fireEvent, render, screen, user } from "@functions/test";

import CardSection from '@features/planning/dashboard-microdemand/components/dashboard/CardSection'
import Card from '@features/planning/dashboard-microdemand/components/dashboard/CardSection/components/Card'

const getSurveyorAssignment = () => {
  axios.get.mockResolvedValueOnce({ data: { data: [] } });
};

const getSupervisorAssignment = () => {
  axios.get.mockResolvedValueOnce({ data: { data: [] } });
};

const getListUser = () => {
  axios.get.mockResolvedValueOnce({ data: { data: [] } });
};
describe('CardSection', () => {
  test('renders Card component', () => {
    render(<Card label="Test Label" value={123} loading={false} />);
  })

  test('renders CardSection component for admin role', () => {
    getSurveyorAssignment();
    getSupervisorAssignment();
    getListUser();

    render(<CardSection user={{ ...user, role_keys: ["admin-survey-branch"] }} />)
  })
  
})