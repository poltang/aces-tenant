/*
ACES Modules Data
====================================
type:             tipe: gpq, aime, sjt, intray
version:          1.0, 1.01
slug:             <tipe>-<version>
acesIndex:        100
method:           selftest / simulation
typeName:         nama resmi tipe
name:             nama versi
title:            name yang diberikan klien,
description:      kalimat deskripsi, dapat diganti klien
length:           jumlah soal
maxTime:          maksimum waktu dalam milisekon,
items:            [],
====================================

AIME      100
CSI       200
GPQ       300
MATE      400
PRO       500
PSI       600
SJT       700
INTRAY    800
*/

const AcesModulesMeta = [
  {
    order:        1,
    type:         'gpq',
    name:         'GPQ',
    method:       'selftest',
    description:  'Rutrum nisle hac massa est blandit urna vel vestibulum.',
    collection:   ['gpq-v1', 'gpq-v2'],
  },
  {
    order:        2,
    type:         'aime',
    name:         'AIME',
    method:       'selftest',
    description:  'Rutrum nisle hac massa est blandit urna vel vestibulum.',
    collection:   ['aime-v1', 'aime-v2'],
  },
  {
    order:        3,
    type:         'mate',
    name:         'MATE',
    method:       'selftest',
    description:  'Rutrum nisle hac massa est blandit urna vel vestibulum.',
    collection:   ['mate-v1', 'mate-v2'],
  },
  {
    order:        4,
    type:         'sjt',
    name:         'SJT',
    method:       'selftest',
    description:  'Rutrum nisle hac massa est blandit urna vel vestibulum.',
    collection:   ['sjt-v1', 'sjt-v2'],
  },
  {
    order:        5,
    type:         'intray',
    name:         'Intray',
    method:       'selftest',
    description:  'Rutrum nisle hac massa est blandit urna vel vestibulum.',
    collection:   ['intray-v1', 'intray-v2'],
  },
  {
    order:        6,
    type:         'interview',
    name:         'Interview',
    method:       'selftest',
    description:  'Rutrum nisle hac massa est blandit urna vel vestibulum.',
    collection:   ['interview-v1', 'interview-v2'],
  }
]

/*

GPQ
type:         'gpq',
variant:      'gpq-v1',
method:       'selftest',
name:         'GPQ Commons',
label:        'GPQ Commons',
description:  'Rutrum nisle hac massa est blandit urna vel vestibulum.',
length:       120,
maxTime:      120,
items: {

}



*/