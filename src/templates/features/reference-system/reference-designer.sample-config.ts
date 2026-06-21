import type {
  ReferenceDesignerSampleConfig,
  ReferenceDocumentTab,
} from './reference-system.types'

export const referenceSampleDocumentTabs: ReferenceDocumentTab[] = [
  { id: 'layout', label: 'Layout', caption: 'Canvas and rulers' },
  { id: 'data', label: 'Data', caption: 'Bindings and datasets' },
  { id: 'preview', label: 'Preview', caption: 'Rendered output' },
]

export const referenceSampleDesignerConfig: ReferenceDesignerSampleConfig = {
  topbarActions: [
    { id: 'new', icon: 'note_add', ariaLabel: 'New report' },
    { id: 'open', icon: 'folder_open', ariaLabel: 'Open report' },
    { id: 'save', icon: 'save', ariaLabel: 'Save report' },
    { id: 'cut', icon: 'content_cut', ariaLabel: 'Cut selection' },
    { id: 'copy', icon: 'content_copy', ariaLabel: 'Copy selection' },
    { id: 'delete', icon: 'delete', ariaLabel: 'Delete selection' },
  ],
  quickActions: [
    { id: 'undo', icon: 'undo', ariaLabel: 'Undo' },
    { id: 'redo', icon: 'redo', ariaLabel: 'Redo' },
    { id: 'duplicate', icon: 'content_copy', ariaLabel: 'Duplicate object' },
  ],
  widgetSections: [
    {
      id: 'basic-items',
      title: 'Basic Items',
      items: [
        { id: 'widget-text', label: 'TextBox', icon: 'text_fields' },
        { id: 'widget-image', label: 'Image', icon: 'image' },
        { id: 'widget-line', label: 'Line', icon: 'show_chart' },
        { id: 'widget-rectangle', label: 'Rectangle', icon: 'crop_16_9' },
      ],
    },
    {
      id: 'comparison',
      title: 'Comparison',
      items: [
        { id: 'widget-column', label: 'Column', icon: 'bar_chart' },
        { id: 'widget-bar', label: 'Bar', icon: 'stacked_bar_chart' },
        { id: 'widget-stacked', label: 'Stacked', icon: 'stacked_line_chart' },
        { id: 'widget-range', label: 'Range', icon: 'equalizer' },
      ],
    },
    {
      id: 'data-regions',
      title: 'Data Regions',
      items: [
        { id: 'widget-table', label: 'Table', icon: 'table_chart' },
        { id: 'widget-list', label: 'List', icon: 'view_list' },
        { id: 'widget-matrix', label: 'Matrix', icon: 'grid_view' },
        { id: 'widget-map', label: 'Map', icon: 'public' },
      ],
    },
  ],
  canvasColumns: [
    'DATE',
    'REPORT ID',
    'CATEGORY',
    'ASSIGNED TO',
    'STATUS',
    'VALUE',
    'TOTAL',
  ],
  canvasObjects: [
    { id: 'logo', label: 'NetToolsKit logo', subtitle: 'Brand image', x: 42, y: 50, width: 170, height: 96, locked: true },
    { id: 'title', label: 'MONTHLY REPORT', subtitle: 'Main report title', x: 520, y: 58, width: 320, height: 74, tone: 'info' },
    { id: 'header', label: 'Header band', subtitle: 'Dataset headers', x: 42, y: 190, width: 1196, height: 96, tone: 'primary' },
    { id: 'kpi', label: 'Safety / KPI strip', subtitle: 'Operational visual alerts', x: 42, y: 334, width: 860, height: 74, tone: 'warning' },
    { id: 'footer', label: 'Footer ownership', subtitle: 'System ownership and signatures', x: 42, y: 428, width: 1196, height: 54 },
  ],
  railActions: [
    { id: 'properties', icon: 'tune', ariaLabel: 'Properties' },
    { id: 'layers', icon: 'layers', ariaLabel: 'Layers' },
    { id: 'filters', icon: 'filter_list', ariaLabel: 'Filters' },
    { id: 'data', icon: 'dataset', ariaLabel: 'Data source' },
    { id: 'settings', icon: 'settings', ariaLabel: 'Settings' },
  ],
  leftStatusSegments: [
    { id: 'row-groups', label: 'Row groups', value: 3 },
    { id: 'warnings', label: 'Warnings', value: 2, tone: 'warning' },
  ],
  rightStatusSegments: [
    { id: 'column-groups', label: 'Column groups', value: 4, tone: 'info' },
    { id: 'snap', label: 'Snap', value: 'On', tone: 'success' },
  ],
  zoomOptions: [50, 75, 100, 125, 150],
}