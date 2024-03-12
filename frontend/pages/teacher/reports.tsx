import { Reports } from '../../src/screens/Teacher/Reports'
import { tokenService } from '../../src/services/tokenService'
import { usersService } from '../../src/services/usersService'
import { PageProps } from './../_app'

export default function ReportsPage({ setShowBackButton }: PageProps) {
  setShowBackButton(true)
  return (
    <>
      <Reports />
    </>
  )
}

export async function getServerSideProps(context: any) {
  const hasSession = await tokenService.getSession(context)
  if (!hasSession) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    }
  }

  const userInfo = usersService.getUserInfoByCookie(context)
  const isTeacher = userInfo?.occupation === 'teacher'
  if (!isTeacher) {
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
      props: {},
    }
  }

  return {
    props: {},
  }
}
