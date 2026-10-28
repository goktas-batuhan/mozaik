import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { Alert } from './alert'

export default function AlertDemo() {
  return (
    <div className="flex w-[min(92vw,460px)] flex-col gap-3">
      <Alert variant="info" icon={<Info />} title="Scheduled maintenance">
        The dashboard is read-only on Sunday between 02:00 and 03:00 UTC.
      </Alert>
      <Alert variant="success" icon={<CircleCheck />} title="Wallet connected">
        You can now sign transactions from this page.
      </Alert>
      <Alert variant="warning" icon={<TriangleAlert />} title="Gas is high">
        Fees are three times the weekly average. Consider waiting before you swap.
      </Alert>
      <Alert variant="destructive" icon={<CircleAlert />} title="Transaction failed">
        The network rejected the request. Check your balance and <a href="#retry">try again</a>.
      </Alert>
    </div>
  )
}
