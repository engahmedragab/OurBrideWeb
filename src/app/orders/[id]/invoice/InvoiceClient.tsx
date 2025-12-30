'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Download, FileText, Printer } from 'lucide-react'
import brandLogo from '@/assets/svg/Brand-logo.svg'
import { UserPageLayout } from '@/components/layout'
import {
    PageHeader,
    ErrorDisplay,
    LoadingOverlay,
    Button,
} from '@/components/ui'
import { useOrderInvoice, useDownloadOrderInvoice } from '@/hooks/orders'
import { useToast } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'

interface InvoiceClientProps {
    orderId: string
}

export function InvoiceClient({ orderId }: InvoiceClientProps) {
    const router = useRouter()
    const { addToast } = useToast()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const orderIdNum = parseInt(orderId, 10)

    // Use generateOrderInvoice for preview/display
    const { data: invoice, isLoading, error } = useOrderInvoice(
        isNaN(orderIdNum) ? null : orderIdNum,
        { enabled: isMounted && !isNaN(orderIdNum) }
    )

    const downloadInvoiceMutation = useDownloadOrderInvoice()

    const handleDownload = () => {
        if (!isNaN(orderIdNum)) {
            downloadInvoiceMutation.mutate(
                { orderId: orderIdNum },
                {
                    onSuccess: () => {
                        addToast('Invoice downloaded successfully', 'success')
                    },
                    onError: (error: Error) => {
                        addToast(error.message || 'Failed to download invoice', 'error')
                    },
                }
            )
        }
    }

    const handlePrint = () => {
        window.print()
    }

    // Show loading state
    if (!isMounted || isLoading) {
        return (
            <UserPageLayout>
                <PageHeader title="Invoice" />
                <LoadingOverlay
                    open={true}
                    title="Loading invoice..."
                    subtitle="Please wait a moment"
                />
            </UserPageLayout>
        )
    }

    // Show error state
    if (error || !invoice) {
        return (
            <UserPageLayout>
                <PageHeader title="Invoice" />
                <ErrorDisplay
                    title="Invoice not found"
                    message={error instanceof Error ? error.message : "The invoice for this order could not be loaded"}
                    actionLabel="Back to Order"
                    actionHref={`/orders/${orderId}`}
                />
            </UserPageLayout>
        )
    }

    // Format dates
    const orderDate = invoice.orderDate
        ? new Date(invoice.orderDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    const preferredDeliveryDate = invoice.preferredDeliveryDate
        ? new Date(invoice.preferredDeliveryDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : null

    return (
        <UserPageLayout>
            {/* Header with Actions */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <PageHeader title={`Invoice #${invoice.orderNumber || invoice.orderId}`} />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={downloadInvoiceMutation.isPending}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        {downloadInvoiceMutation.isPending ? 'Downloading...' : 'Download PDF'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="flex items-center gap-2 print:hidden"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Invoice Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm print:shadow-none">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-24 font-bold text-gray-900 mb-2">INVOICE</h1>
                        <p className="text-14 text-gray-600">Order #{invoice.orderNumber || invoice.orderId || 'N/A'}</p>
                        {orderDate && (
                            <p className="text-14 text-gray-600">Date: {orderDate}</p>
                        )}
                        {invoice.fileName && (
                            <p className="text-12 text-gray-500 mt-1">File: {invoice.fileName}</p>
                        )}
                    </div>
                    <div className="text-right">
                        {invoice.providerName && (
                            <div className="mb-4">
                                <p className="text-14 font-semibold text-gray-900 mb-1">From:</p>
                                <p className="text-14 text-gray-700">{invoice.providerName}</p>
                                {invoice.providerEmail && (
                                    <p className="text-14 text-gray-600">{invoice.providerEmail}</p>
                                )}
                                {invoice.providerPhone && (
                                    <p className="text-14 text-gray-600">{invoice.providerPhone}</p>
                                )}
                            </div>
                        )}
                        <div>
                            <p className="text-14 font-semibold text-gray-900 mb-1">To:</p>
                            {invoice.billingName && (
                                <p className="text-14 text-gray-700">{invoice.billingName}</p>
                            )}
                            {invoice.clientName && (
                                <p className="text-14 text-gray-700">{invoice.clientName}</p>
                            )}
                            {invoice.clientEmail && (
                                <p className="text-14 text-gray-600">{invoice.clientEmail}</p>
                            )}
                            {invoice.clientPhone && (
                                <p className="text-14 text-gray-600">{invoice.clientPhone}</p>
                            )}
                            {invoice.billingAddress && invoice.billingAddress.trim() && invoice.billingAddress !== ', , ' && (
                                <p className="text-14 text-gray-600 mt-1">{invoice.billingAddress}</p>
                            )}
                            {(!invoice.billingName && !invoice.clientName && !invoice.clientEmail && !invoice.clientPhone && (!invoice.billingAddress || invoice.billingAddress === ', , ')) && (
                                <p className="text-14 text-gray-500 italic">No billing information available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-6">
                    <h2 className="text-18 font-semibold text-gray-900 mb-4">Items</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-14 font-semibold text-gray-900">Item</th>
                                    <th className="text-right py-3 px-4 text-14 font-semibold text-gray-900">Quantity</th>
                                    <th className="text-right py-3 px-4 text-14 font-semibold text-gray-900">Price</th>
                                    <th className="text-right py-3 px-4 text-14 font-semibold text-gray-900">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0 ? (
                                    invoice.items.map((item, index) => {
                                        const itemName = item.productName || item.serviceName || `Item ${index + 1}`
                                        return (
                                            <tr key={item.id || index} className="border-b border-gray-100">
                                                <td className="py-3 px-4 text-14 text-gray-900">
                                                    {itemName}
                                                    {item.description && (
                                                        <p className="text-12 text-gray-500 mt-1">{item.description}</p>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-14 text-gray-600 text-right">{item.quantity || 1}</td>
                                                <td className="py-3 px-4 text-14 text-gray-600 text-right">
                                                    {item.price?.toLocaleString() || '0'} EGP
                                                </td>
                                                <td className="py-3 px-4 text-14 font-medium text-gray-900 text-right">
                                                    {item.total?.toLocaleString() || '0'} EGP
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-4 text-center text-14 text-gray-500">
                                            No items found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Invoice Summary */}
                <div className="flex justify-end mb-6">
                    <div className="w-full max-w-md space-y-2">
                        <div className="flex justify-between text-14 text-gray-700">
                            <span>Subtotal:</span>
                            <span className="font-medium">{invoice.totalAmount?.toLocaleString() || '0'} EGP</span>
                        </div>
                        {invoice.discountAmount !== null && invoice.discountAmount !== undefined && invoice.discountAmount > 0 && (
                            <div className="flex justify-between text-14 text-green-600">
                                <span>Discount:</span>
                                <span className="font-medium">-{invoice.discountAmount.toLocaleString()} EGP</span>
                            </div>
                        )}
                        {invoice.depositAmount !== null && invoice.depositAmount !== undefined && invoice.depositAmount > 0 && (
                            <div className="flex justify-between text-14 text-gray-700">
                                <span>Deposit:</span>
                                <span className="font-medium">{invoice.depositAmount.toLocaleString()} EGP</span>
                            </div>
                        )}
                        {invoice.discountCodes && invoice.discountCodes.length > 0 && (
                            <div className="flex justify-between text-14 text-gray-600">
                                <span>Discount Codes:</span>
                                <span className="font-medium">{invoice.discountCodes.join(', ')}</span>
                            </div>
                        )}
                        <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between text-18 font-bold text-gray-900">
                                <span>Total:</span>
                                <span>{invoice.finalAmount?.toLocaleString() || invoice.totalAmount?.toLocaleString() || '0'} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                {(invoice.paymentMethod || invoice.paymentStatus || invoice.couponCode || invoice.paymentAmount) && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-16 font-semibold text-gray-900 mb-3">Payment Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-14 text-gray-700">
                            {invoice.paymentMethod && (
                                <div>
                                    <span className="font-medium">Payment Method:</span> {invoice.paymentMethod}
                                </div>
                            )}
                            {invoice.paymentStatus && (
                                <div>
                                    <span className="font-medium">Payment Status:</span> {invoice.paymentStatus}
                                </div>
                            )}
                            {invoice.couponCode && (
                                <div>
                                    <span className="font-medium">Coupon Code:</span> {invoice.couponCode}
                                </div>
                            )}
                            {invoice.paymentAmount !== null && invoice.paymentAmount !== undefined && (
                                <div>
                                    <span className="font-medium">Payment Amount:</span> {invoice.paymentAmount.toLocaleString()} EGP
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Payment Plan Information */}
                {invoice.hasPaymentPlan && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-16 font-semibold text-gray-900 mb-3">Payment Plan</h3>
                        <div className="grid grid-cols-2 gap-4 text-14 text-gray-700">
                            {invoice.paymentPlanName && (
                                <div>
                                    <span className="font-medium">Plan:</span> {invoice.paymentPlanName}
                                </div>
                            )}
                            {invoice.numberOfPayments !== null && invoice.numberOfPayments !== undefined && (
                                <div>
                                    <span className="font-medium">Number of Payments:</span> {invoice.numberOfPayments}
                                </div>
                            )}
                            {invoice.paymentAmount !== null && invoice.paymentAmount !== undefined && (
                                <div>
                                    <span className="font-medium">Payment Amount:</span> {invoice.paymentAmount.toLocaleString()} EGP
                                </div>
                            )}
                            {invoice.firstPaymentDate && (
                                <div>
                                    <span className="font-medium">First Payment:</span>{' '}
                                    {new Date(invoice.firstPaymentDate).toLocaleDateString('en-GB')}
                                </div>
                            )}
                            {invoice.lastPaymentDate && (
                                <div>
                                    <span className="font-medium">Last Payment:</span>{' '}
                                    {new Date(invoice.lastPaymentDate).toLocaleDateString('en-GB')}
                                </div>
                            )}
                            {invoice.paymentPlanStatus && (
                                <div>
                                    <span className="font-medium">Status:</span> {invoice.paymentPlanStatus}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Delivery Information */}
                {(preferredDeliveryDate || invoice.isUrgent || invoice.requireClientConfirmation) && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-16 font-semibold text-gray-900 mb-2">Delivery Information</h3>
                        <div className="space-y-2 text-14 text-gray-700">
                            {preferredDeliveryDate && (
                                <p>Preferred Delivery Date: {preferredDeliveryDate}</p>
                            )}
                            {invoice.isUrgent && (
                                <p className="text-orange-600 font-medium">⚠️ Urgent Order</p>
                            )}
                            {invoice.requireClientConfirmation && (
                                <p>
                                    Requires Client Confirmation:{' '}
                                    <span className={invoice.clientConfirmed ? 'text-green-600' : 'text-yellow-600'}>
                                        {invoice.clientConfirmed ? 'Confirmed' : 'Pending'}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Notes */}
                {(invoice.orderNotes || invoice.providerNotes) && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-16 font-semibold text-gray-900 mb-2">Notes</h3>
                        {invoice.orderNotes && (
                            <p className="text-14 text-gray-700 mb-2">{invoice.orderNotes}</p>
                        )}
                        {invoice.providerNotes && (
                            <p className="text-14 text-gray-700">{invoice.providerNotes}</p>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="pt-6 border-t border-gray-200 text-center">
                    <p className="text-12 text-gray-500 mb-4">Thank you for your business!</p>
                    {invoice.providerName && (
                        <p className="text-12 text-gray-500 mb-4">{invoice.providerName}</p>
                    )}

                    {/* OurBride Signature/Logo */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="relative w-40 h-20">
                                <Image
                                    src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src}
                                    alt="OurBride Logo"
                                    fill
                                    sizes="160px"
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-14 font-semibold text-gray-700">OurBride</p>
                            <p className="text-12 text-gray-500">Your trusted wedding partner</p>
                        </div>
                    </div>
                </div>
            </div>
        </UserPageLayout>
    )
}

