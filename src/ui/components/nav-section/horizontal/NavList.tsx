import { getActive, isExternalLink } from '..'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// @mui
import { Link } from '@mui/material'
import NavItem from './NavItem'
//
import { NavListProps } from '../type'
import { PaperStyle } from './style'
import { useRootStore } from 'src/stores'
import axios from 'axios'

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps
  depth: number
  hasChildren: boolean
}

export default function NavList({
  data,
  depth,
  hasChildren,
}: NavListRootProps) {
  const menuRef = useRef(null)

  const navigate = useNavigate()

  const { pathname } = useLocation()

  const active = getActive(data.path, pathname)

  const [open, setOpen] = useState(false)

  const { authStore } = useRootStore()

  const isPfizerVendorAdmin = authStore.user.authority.pfizerAdmin
  const [isPfizerAdmin, setIsPfizerAdmin] = useState(false)
  useEffect(() => {
    authStore.user.authority.whitelist.forEach(async (list: any) => {
      const params = {
        filter: {
          _id: list.clientId,
        },
      }
      const { data } = await axios.get('/v1/clientUnits', {
        params,
      })
      if (data[0].vendor !== '') {
        setIsPfizerAdmin(true)
        authStore.isPfizerAdmin = true
        return
      }
    })
  }, [])

  useEffect(() => {
    if (open) {
      handleClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickItem = () => {
    if (!hasChildren) {
      navigate(data.path)
    }
  }

  console.log(authStore.user.authority.pfizerAdmin)

  return (
    <>
      {isExternalLink(data.path) ? (
        data.title === 'Simulations' ? (
          authStore.user.authority.pfizerAdmin ? (
            <Link
              href={data.path}
              target="_blank"
              rel="noopener"
              underline="none"
            >
              <NavItem item={data} depth={depth} open={open} active={active} />
            </Link>
          ) : (
            <></>
          )
        ) : data.title === 'Data' ? (
          isPfizerVendorAdmin ? (
            <Link
              href={data.path}
              target="_blank"
              rel="noopener"
              underline="none"
            >
              <NavItem item={data} depth={depth} open={open} active={active} />
            </Link>
          ) : (
            <></>
          )
        ) : data.title === 'Dashboard' ? (
          isPfizerAdmin ? (
            <Link
              href={data.path}
              target="_blank"
              rel="noopener"
              underline="none"
            >
              <NavItem item={data} depth={depth} open={open} active={active} />
            </Link>
          ) : (
            <></>
          )
        ) : (
          <Link
            href={data.path}
            target="_blank"
            rel="noopener"
            underline="none"
          >
            <NavItem item={data} depth={depth} open={open} active={active} />
          </Link>
        )
      ) : data.title === 'Simulations' ? (
        !authStore.user.authority.pfizerAdmin ? (
          <NavItem
            item={data}
            depth={depth}
            open={open}
            active={active}
            ref={menuRef}
            onClick={handleClickItem}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          />
        ) : (
          <></>
        )
      ) : data.title === 'Data' ? (
        isPfizerAdmin ? (
          <NavItem
            item={data}
            depth={depth}
            open={open}
            active={active}
            ref={menuRef}
            onClick={handleClickItem}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          />
        ) : (
          <></>
        )
      ) : data.title === 'Dashboard' ? (
        isPfizerAdmin ? (
          <NavItem
            item={data}
            depth={depth}
            open={open}
            active={active}
            ref={menuRef}
            onClick={handleClickItem}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          />
        ) : (
          <></>
        )
      ) : (
        <NavItem
          item={data}
          depth={depth}
          open={open}
          active={active}
          ref={menuRef}
          onClick={handleClickItem}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        />
      )}

      {hasChildren && (
        <PaperStyle
          open={open}
          anchorEl={menuRef.current}
          anchorOrigin={
            depth === 1
              ? { vertical: 'bottom', horizontal: 'left' }
              : { vertical: 'center', horizontal: 'right' }
          }
          transformOrigin={
            depth === 1
              ? { vertical: 'top', horizontal: 'left' }
              : { vertical: 'center', horizontal: 'left' }
          }
          PaperProps={{
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
          }}
        >
          <NavSubList data={data.children} depth={depth} />
        </PaperStyle>
      )}
    </>
  )
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavListProps[]
  depth: number
}

function NavSubList({ data, depth }: NavListSubProps) {
  const { authStore } = useRootStore()
  return (
    <>
      {data.map((list) =>
        list.title === 'User Management' ? (
          !authStore.user.authority.pfizerAdmin ? (
            <NavList
              key={list.title + list.path}
              data={list}
              depth={depth + 1}
              hasChildren={!!list.children}
            />
          ) : (
            <></>
          )
        ) : (
          <NavList
            key={list.title + list.path}
            data={list}
            depth={depth + 1}
            hasChildren={!!list.children}
          />
        )
      )}
    </>
  )
}
